const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const MenuItem = require('./models/MenuItem');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create professional users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@canteen.com',
        password: 'admin123',
        role: 'admin',
        isVerified: true,
        phone: '+91 9876543210'
      },
      {
        name: 'Kitchen Staff',
        email: 'staff@canteen.com',
        password: 'staff123',
        role: 'staff',
        isVerified: true,
        phone: '+91 9876543211'
      },
      {
        name: 'Regular Customer',
        email: 'customer@canteen.com',
        password: 'customer123',
        role: 'customer',
        isVerified: true,
        phone: '+91 9876543212'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'john123',
        role: 'customer',
        isVerified: true
      }
    ]);

    console.log('✅ Users created');
    const menuItems = await MenuItem.create([
  {
    name: 'Crispy Masala Dosa',
    description: 'Golden crispy crepe filled with spiced potatoes, served with coconut chutney and sambar',
    price: 80,
    category: 'breakfast',
    preparationTime: 12,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&h=300&fit=crop',
    ingredients: ['Rice batter', 'Potatoes', 'Spices', 'Coconut'],
    spiceLevel: 'medium',
    rating: 4.5,
    popular: true
  },
  {
    name: 'Butter Chicken',
    description: 'Tender chicken in rich creamy tomato butter sauce, served with butter naan',
    price: 299,
    category: 'lunch',
    preparationTime: 20,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    ingredients: ['Chicken', 'Butter', 'Cream', 'Tomatoes', 'Spices'],
    spiceLevel: 'medium',
    rating: 4.8,
    popular: true
  },
  {
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese cubes grilled to perfection with bell peppers and onions',
    price: 249,
    category: 'snacks',
    preparationTime: 15,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    ingredients: ['Paneer', 'Bell peppers', 'Yogurt', 'Spices'],
    spiceLevel: 'mild',
    rating: 4.6,
    popular: true
  },
  {
    name: 'Hyderabadi Biryani',
    description: 'Fragrant basmati rice cooked with tender meat and aromatic spices',
    price: 349,
    category: 'dinner',
    preparationTime: 25,
    image: 'https://img.freepik.com/premium-photo/plate-food-with-noodles-meat-vegetables_1197144-525.jpg?semt=ais_hybrid&w=740&q=80',
    ingredients: ['Basmati rice', 'Chicken', 'Spices', 'Saffron'],
    spiceLevel: 'spicy',
    rating: 4.9,
    popular: true
  },
  {
    name: 'Mango Lassi',
    description: 'Refreshing yogurt drink with sweet mango pulp and cardamom',
    price: 99,
    category: 'beverages',
    preparationTime: 5,
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop',
    ingredients: ['Yogurt', 'Mango', 'Cardamom', 'Sugar'],
    spiceLevel: 'mild',
    rating: 4.7
  },
  {
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings soaked in rose-scented sugar syrup',
    price: 129,
    category: 'desserts',
    preparationTime: 8,
    image: 'https://sharmanjainsweets.com/cdn/shop/articles/Untitled_design_eb07557c-e535-4bdf-9063-8a1f1cffa58c.png?v=1751535882',
    ingredients: ['Milk powder', 'Sugar', 'Rose water', 'Cardamom'],
    spiceLevel: 'mild',
    rating: 4.4
  },
  {
    name: 'Samosa Chat',
    description: 'Crispy samosas topped with chickpeas, yogurt, and tangy chutneys',
    price: 119,
    category: 'snacks',
    preparationTime: 10,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    ingredients: ['Samosa', 'Chickpeas', 'Yogurt', 'Chutneys'],
    spiceLevel: 'medium',
    rating: 4.3
  },
  {
    name: 'Masala Chai',
    description: 'Traditional Indian tea brewed with aromatic spices and milk',
    price: 49,
    category: 'beverages',
    preparationTime: 7,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
    ingredients: ['Tea leaves', 'Milk', 'Ginger', 'Cardamom'],
    spiceLevel: 'mild',
    rating: 4.2,
    popular: true
  }
]);

    // Create tempting menu items with high-quality food images
    

    console.log('✅ Menu items created with tempting images');
    console.log('🎉 Professional seed data created successfully!');
    
    console.log('\n📋 BUSINESS TEST ACCOUNTS:');
    console.log('   👑 Admin: admin@canteen.com / admin123');
    console.log('   👨‍🍳 Staff: staff@canteen.com / staff123');
    console.log('   👥 Customer: customer@canteen.com / customer123');
    console.log('   👥 Customer: john@example.com / john123');
    
    console.log('\n📊 DATABASE:');
    console.log('   Connect MongoDB Compass to: mongodb://localhost:27017/canteen_management');
    console.log('   View users, menu items, and orders in real-time!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();