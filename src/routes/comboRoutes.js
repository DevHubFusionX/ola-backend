const express = require('express');
const router = express.Router();
const comboController = require('../controllers/comboController');
const authenticateToken = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', comboController.getAllCombos);
router.get('/:id', comboController.getComboById);

module.exports = router;
