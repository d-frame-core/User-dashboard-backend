const express = require('express');
const router = express.Router();
const HelpController = require('../controllers/HelpController');

router.get('/',  HelpController.getAllhelp);
router.post('/',  HelpController.createHelp);
router.put('/update/:id',HelpController.updateHelp);
router.delete('/delete', HelpController.delete);
router.get('/helpby/:id', HelpController.gethelpById );


module.exports = router;
