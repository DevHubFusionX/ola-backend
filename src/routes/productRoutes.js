const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
