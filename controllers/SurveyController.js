const mongoose = require('mongoose');
const Survey = require("../models/SurveyModel");

const createSurvey = async (req, res) => {
  const newSurvey = new Survey({
    surveyName: req.body.surveyName,
    totalQues: req.body.totalQues,
    totalRes: req.body.totalRes,
    statusCampaign: req.body.statusCampaign,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  });
  try {
    const savedSurvey = await newSurvey.save();
    res.status(201).json({ message: "Survey created successfully", id: savedSurvey._id });
  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
};

const getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({});
    res.status(200).json(surveys);
  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
};

const getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (survey) {
      res.status(200).json(survey);
    } else {
      res.status(200).json({ message: "No survey found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
};

const updateSurvey = async (req, res) => {
  try {
    const updatedSurvey = await Survey.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json({ message: "Survey updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
};

const deleteSurvey = async (req, res) => {
  try {
    const deletedSurvey = await Survey.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Survey deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error occurred" });
  }
};

module.exports = {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey
};
