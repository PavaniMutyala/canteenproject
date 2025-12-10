const express = require('express');
const MenuItem = require('../models/MenuItem');
const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let filter = { isAvailable: true };
    if (category && category !== 'all') {
      filter.category = category;
    }

    const menuItems = await MenuItem.find(filter).sort({ name: 1 });
    res.json(menuItems);
  } catch (error) {
    console.error('Menu error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single menu item
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;