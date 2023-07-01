const express = require('express');
const router = express.Router();
const FaqController = require('../controllers/FaqController');

// Create a new FAQ
router.post('/', FaqController.createFAQ);

// Get all FAQs
router.get('/faq', FaqController.getAllFAQs);

// Get a specific FAQ by ID
router.get('/faq/:id', FaqController.getFAQById);


router.put('/faq/:id', FaqController.updateFAQById);


module.exports = router;