require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Admin = require('./models/Admin');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing collections
    await Product.deleteMany({});
    await Admin.deleteMany({});
    console.log('Cleared existing products and admins');

    // Seed Admin
    const adminEmail = 'fanyanwu83@gmail.com';
    const adminPassword = 'admin123'; // Temporary password
    await Admin.create({
      email: adminEmail,
      password: adminPassword
    });
    console.log(`Admin user seeded: ${adminEmail}`);

    const products = [
      {
        name: "Premium Cotton Kaftan",
        price: "₦18,000",
        category: "Traditional",
        description: "Elegant traditional kaftan made from premium cotton fabric. Perfect for formal occasions and daily wear.",
        fabricType: "100% Cotton",
        texture: "Smooth and breathable",
        quality: "Premium",
        care: "Machine wash cold, hang dry",
        image: "https://res.cloudinary.com/dyfi4enfl/image/upload/v1/moderate_ustaz_products/kaftan1",
        images: [
          "https://res.cloudinary.com/dyfi4enfl/image/upload/v1/moderate_ustaz_products/kaftan1",
          "https://res.cloudinary.com/dyfi4enfl/image/upload/v1/moderate_ustaz_products/kaftan2"
        ],
        colors: [
          {
            name: "White",
            images: ["https://res.cloudinary.com/dyfi4enfl/image/upload/v1/moderate_ustaz_products/kaftan_white1"]
          },
          {
            name: "Navy Blue",
            images: ["https://res.cloudinary.com/dyfi4enfl/image/upload/v1/moderate_ustaz_products/kaftan_navy1"]
          }
        ]
      },
      {
        name: "Embroidered Agbada Set",
        price: "₦35,000",
        category: "Premium",
        description: "Luxurious hand-embroidered Agbada with matching cap and trousers. Crafted for special occasions.",
        fabricType: "Silk blend",
        texture: "Smooth with intricate embroidery",
        quality: "Luxury",
        care: "Dry clean only",
        image: "https://res.cloudinary.com/dyfi4enfl/image/upload/v1/moderate_ustaz_products/agbada1",
        images: [
          "https://res.cloudinary.com/dyfi4enfl/image/upload/v1/moderate_ustaz_products/agbada1",
          "https://res.cloudinary.com/dyfi4enfl/image/upload/v1/moderate_ustaz_products/agbada2"
        ]
      },
      {
        name: "Ankara Print Fabric",
        price: "₦8,500",
        category: "Fabrics",
        description: "Vibrant Ankara print fabric, 6 yards. High-quality wax print perfect for traditional and modern designs.",
        fabricType: "Cotton wax print",
        texture: "Smooth with vibrant colors",
        quality: "Standard",
        care: "Machine wash warm, iron on medium heat",
        image: "https://res.cloudinary.com/dyfi4enfl/image/upload/v1/moderate_ustaz_products/ankara1",
        images: [
          "https://res.cloudinary.com/dyfi4enfl/image/upload/v1/moderate_ustaz_products/ankara1",
          "https://res.cloudinary.com/dyfi4enfl/image/upload/v1/moderate_ustaz_products/ankara2"
        ],
        colors: [
          {
            name: "Red & Gold",
            images: ["https://res.cloudinary.com/dyfi4enfl/image/upload/v1/moderate_ustaz_products/ankara_red1"]
          },
          {
            name: "Blue & Yellow",
            images: ["https://res.cloudinary.com/dyfi4enfl/image/upload/v1/moderate_ustaz_products/ankara_blue1"]
          }
        ]
      }
    ];

    await Product.insertMany(products);
    console.log('Database seeded successfully with detailed products');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();