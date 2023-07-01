const express = require('express');
const router = express.Router();
const controller = require('../controllers/AdsController')

router.get("/:id", controller.getAd);
router.post("/", controller.upload.single('image'), controller.postAd);
router.patch("/:id", controller.updateAd);
router.delete("/:id", controller.deleteAd);

module.exports = router;