require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const productRoutes = require('./src/routes/productRoutes');
const comboRoutes = require('./src/routes/comboRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: ['https://moderate-textile.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));
app.use(express.json());

// Keep-alive service for free tier
if (process.env.NODE_ENV === 'production') {
  require('./keepAlive');
}

// Routes
app.use('/api/products', productRoutes);
app.use('/api/combos', comboRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoints
app.get('/', (req, res) => {
  res.json({
    message: 'Moderate Textile API is running',
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});