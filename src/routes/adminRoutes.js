const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const comboController = require('../controllers/comboController');
const authenticateToken = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/login', adminController.login);
router.post('/change-password', authenticateToken, adminController.changePassword);
router.post('/change-email', authenticateToken, adminController.changeEmail);
router.get('/verify', authenticateToken, adminController.verifyToken);

// Products Admin
router.post('/products', authenticateToken, upload.array('images', 10), productController.createProduct);
router.put('/products/:id', authenticateToken, upload.array('images', 10), productController.updateProduct);
router.delete('/products/:id', authenticateToken, productController.deleteProduct);

// Combos Admin
router.post('/combos', authenticateToken, upload.array('images', 10), comboController.createCombo);
router.put('/combos/:id', authenticateToken, upload.array('images', 10), comboController.updateCombo);
router.delete('/combos/:id', authenticateToken, comboController.deleteCombo);

module.exports = router;
