const express = require('express');
const router = express.Router();
const LearnMoreController = require('../controllers/LearnmoreController');

router.get('/',  LearnMoreController.getAllLearnMore);
router.post('/', LearnMoreController.createLearnMore);
router.put('/update/:id', LearnMoreController.updateLearnMore );
router.delete('/delete', LearnMoreController.delete);
router.get('/learnMore/:id', LearnMoreController.getLearnMoreById);


module.exports = router;
