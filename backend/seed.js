import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config({ path: './.env' });

const products = [
    // Vegetables
    {
        name: 'Tomato',
        nameHindi: 'टमाटर',
        description: 'Fresh red tomatoes, perfect for salads and cooking',
        price: 40,
        unit: 'kg',
        category: 'vegetables',
        image: 'https://images.unsplash.com/photo-1546470427-227c7c5f0a22?w=500&h=500&fit=crop',
        stock: 100,
        isFeatured: true,
        discount: 10,
    },
    {
        name: 'Potato',
        nameHindi: 'आलू',
        description: 'Fresh farm potatoes, ideal for all cooking purposes',
        price: 30,
        unit: 'kg',
        category: 'vegetables',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber9a7?w=500&h=500&fit=crop',
        stock: 200,
        isFeatured: true,
    },
    {
        name: 'Onion',
        nameHindi: 'प्याज',
        description: 'Fresh red onions, essential for every kitchen',
        price: 35,
        unit: 'kg',
        category: 'vegetables',
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&h=500&fit=crop',
        stock: 150,
        isFeatured: true,
    },
    {
        name: 'Carrot',
        nameHindi: 'गाजर',
        description: 'Orange carrots rich in vitamins',
        price: 45,
        unit: 'kg',
        category: 'vegetables',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&h=500&fit=crop',
        stock: 80,
        isFeatured: true,
        discount: 5,
    },
    {
        name: 'Cauliflower',
        nameHindi: 'फूलगोभी',
        description: 'Fresh white cauliflower heads',
        price: 50,
        unit: 'piece',
        category: 'vegetables',
        image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&h=500&fit=crop',
        stock: 60,
    },
    {
        name: 'Cabbage',
        nameHindi: 'पत्ता गोभी',
        description: 'Green cabbage, perfect for salads',
        price: 40,
        unit: 'piece',
        category: 'vegetables',
        image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500&h=500&fit=crop',
        stock: 50,
    },
    {
        name: 'Green Chilli',
        nameHindi: 'हरी मिर्च',
        description: 'Spicy green chillies',
        price: 80,
        unit: 'kg',
        category: 'vegetables',
        image: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=500&h=500&fit=crop',
        stock: 40,
    },
    {
        name: 'Capsicum',
        nameHindi: 'शिमला मिर्च',
        description: 'Fresh green bell peppers',
        price: 80,
        unit: 'kg',
        category: 'vegetables',
        image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&h=500&fit=crop',
        stock: 45,
        discount: 15,
    },

    // Fruits
    {
        name: 'Apple',
        nameHindi: 'सेब',
        description: 'Fresh Shimla apples, sweet and crunchy',
        price: 180,
        unit: 'kg',
        category: 'fruits',
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&h=500&fit=crop',
        stock: 100,
        isFeatured: true,
    },
    {
        name: 'Banana',
        nameHindi: 'केला',
        description: 'Ripe yellow bananas, rich in potassium',
        price: 50,
        unit: 'dozen',
        category: 'fruits',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&h=500&fit=crop',
        stock: 150,
        isFeatured: true,
    },
    {
        name: 'Orange',
        nameHindi: 'संतरा',
        description: 'Juicy Nagpur oranges',
        price: 120,
        unit: 'kg',
        category: 'fruits',
        image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=500&h=500&fit=crop',
        stock: 80,
        discount: 10,
    },
    {
        name: 'Mango',
        nameHindi: 'आम',
        description: 'Sweet Alphonso mangoes (seasonal)',
        price: 250,
        unit: 'kg',
        category: 'fruits',
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&h=500&fit=crop',
        stock: 60,
        isFeatured: true,
    },
    {
        name: 'Grapes',
        nameHindi: 'अंगूर',
        description: 'Sweet green seedless grapes',
        price: 90,
        unit: 'kg',
        category: 'fruits',
        image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&h=500&fit=crop',
        stock: 40,
    },

    // Leafy Greens
    {
        name: 'Spinach',
        nameHindi: 'पालक',
        description: 'Fresh organic spinach leaves',
        price: 30,
        unit: 'bunch',
        category: 'leafy',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&h=500&fit=crop',
        stock: 100,
        isFeatured: true,
    },
    {
        name: 'Coriander',
        nameHindi: 'धनिया',
        description: 'Fresh coriander leaves for garnishing',
        price: 20,
        unit: 'bunch',
        category: 'leafy',
        image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500&h=500&fit=crop',
        stock: 80,
    },
    {
        name: 'Mint',
        nameHindi: 'पुदीना',
        description: 'Fresh mint leaves',
        price: 25,
        unit: 'bunch',
        category: 'leafy',
        image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=500&h=500&fit=crop',
        stock: 70,
    },
    {
        name: 'Fenugreek',
        nameHindi: 'मेथी',
        description: 'Fresh methi leaves',
        price: 30,
        unit: 'bunch',
        category: 'leafy',
        image: 'https://images.unsplash.com/photo-1515543904822-1bc32f65dadd?w=500&h=500&fit=crop',
        stock: 60,
    },

    // Exotic
    {
        name: 'Avocado',
        nameHindi: 'एवोकाडो',
        description: 'Imported ripe avocados',
        price: 250,
        unit: 'piece',
        category: 'exotic',
        image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&h=500&fit=crop',
        stock: 30,
        isFeatured: true,
        discount: 20,
    },
    {
        name: 'Broccoli',
        nameHindi: 'ब्रोकोली',
        description: 'Fresh green broccoli heads',
        price: 120,
        unit: 'piece',
        category: 'exotic',
        image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&h=500&fit=crop',
        stock: 40,
    },
    {
        name: 'Zucchini',
        nameHindi: 'तोरी',
        description: 'Fresh green zucchini',
        price: 80,
        unit: 'kg',
        category: 'exotic',
        image: 'https://images.unsplash.com/photo-1563252722-6434563a985d?w=500&h=500&fit=crop',
        stock: 35,
    },

    // Herbs
    {
        name: 'Ginger',
        nameHindi: 'अदरक',
        description: 'Fresh organic ginger root',
        price: 150,
        unit: 'kg',
        category: 'herbs',
        image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500&h=500&fit=crop',
        stock: 50,
        isFeatured: true,
    },
    {
        name: 'Garlic',
        nameHindi: 'लहसुन',
        description: 'Fresh garlic bulbs',
        price: 200,
        unit: 'kg',
        category: 'herbs',
        image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500&h=500&fit=crop',
        stock: 60,
    },
    {
        name: 'Curry Leaves',
        nameHindi: 'करी पत्ता',
        description: 'Fresh aromatic curry leaves',
        price: 20,
        unit: 'bunch',
        category: 'herbs',
        image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500&h=500&fit=crop',
        stock: 40,
    },
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Product.deleteMany({});
        console.log('Cleared existing products');

        await Product.insertMany(products);
        console.log(`Seeded ${products.length} products successfully!`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
