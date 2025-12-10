const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const router = express.Router();

// Middleware to verify token
const auth = require('../middleware/auth');
router.use(auth);

// Get all orders (with filters)
router.get('/', async (req, res) => {
  try {
    const { status, user } = req.query;
    
    let filter = {};
    
    // If user query is 'my', show only current user's orders
    if (user === 'my') {
      filter.customer = req.userId;
    }
    
    // Filter by status if provided
    if (status && status !== 'all') {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('customer', 'name email')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.menuItem', 'name price description');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is staff/admin
    if (order.customer._id.toString() !== req.userId && !['staff', 'admin'].includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { items } = req.body;

    // Calculate total and get menu item details
    let totalAmount = 0;
    let maxPreparationTime = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ message: `Item ${item.menuItem} not available` });
      }

      totalAmount += menuItem.price * item.quantity;
      maxPreparationTime = Math.max(maxPreparationTime, menuItem.preparationTime);

      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Get queue position
    const pendingOrdersCount = await Order.countDocuments({ 
      status: { $in: ['pending', 'confirmed', 'preparing'] } 
    });

    const order = await Order.create({
      customer: req.userId,
      items: orderItems,
      totalAmount,
      estimatedTime: maxPreparationTime,
      queuePosition: pendingOrdersCount + 1
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('items.menuItem', 'name price');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only staff/admin can update orders, or customers can only cancel their own orders
    if (['staff', 'admin'].includes(req.userRole)) {
      order.status = status;
    } else if (req.userId === order.customer.toString() && status === 'cancelled') {
      // Customers can only cancel their own pending orders
      if (order.status === 'pending') {
        order.status = 'cancelled';
      } else {
        return res.status(400).json({ message: 'Cannot cancel order after confirmation' });
      }
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('items.menuItem', 'name price');

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;