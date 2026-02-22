const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      // New jewelry categories
      'Jewelry', 'Chains', 'Watches', 'Bags', 'Hair Accessories', 'Earrings', 'Bracelets', 'Rings', 'Other',
      // Legacy categories (backward compat with existing data)
      'Traditional', 'Casual', 'Premium', 'Fabrics', 'Accessories'
    ]
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  colors: [{
    name: String,
    images: [String]
  }],
  material: {
    type: String,
    trim: true
  },
  style: {
    type: String,
    trim: true
  },
  quality: {
    type: String,
    trim: true
  },
  care: {
    type: String,
    trim: true
  },
  // Keep old field for backward compat with existing data
  fabricType: {
    type: String,
    trim: true
  },
  texture: {
    type: String,
    trim: true
  },
  cloudinaryId: {
    type: String
  },
  cloudinaryIds: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);