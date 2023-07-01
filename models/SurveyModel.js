const mongoose = require('mongoose');
const surveySchema = new mongoose.Schema({
    surveyName: {
      type: String,
      required: true
    },
    totalQues: [{
      type: Number,
      required: true
    }],
    totalRes: {
      type: Number,
      required: true
    },
    statusCampaign: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  });
  
  const Survey = mongoose.model("Survey", surveySchema);
  module.exports = Survey;
  