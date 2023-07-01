const express = require("express");
const router = express.Router();
const surveyController = require("../controllers/surveyController");

router.post("/", surveyController.createSurvey);
router.get("/", surveyController.getAllSurveys);
router.get("/:id", surveyController.getSurveyById);
router.patch("/:id", surveyController.updateSurvey);
router.delete("/:id", surveyController.deleteSurvey);

module.exports = router;