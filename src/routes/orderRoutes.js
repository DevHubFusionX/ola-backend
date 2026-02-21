const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Public route for creating an order
router.post('/', orderController.createOrder);

// These would normally be protected by admin middleware
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
