const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

const { upload } = require('../config/cloudinary');

// Public route for creating an order - with receipt upload
router.post('/', upload.single('receipt'), orderController.createOrder);

// These would normally be protected by admin middleware
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
