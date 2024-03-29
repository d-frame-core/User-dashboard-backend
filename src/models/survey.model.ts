/** @format */

const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  surveyName: {
    type: String,
    required: true,
  },
  surveyDescription: {
    type: String,
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  totalQues: [
    {
      questionNumber: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      options: [
        {
          type: String,
          required: true,
        },
      ],
      userAnswers: [
        [
          {
            type: String,
            ref: 'User',
          },
        ],
      ],
    },
  ],
  totalRes: {
    type: Number,
  },
  totalReward: {
    type: Number,
    required: true,
  },
  statusCampaign: {
    type: String,
    default: 'unverified', //verified,unverified,stop,completed
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const SurveySchema = mongoose.model('Survey', surveySchema);

export { SurveySchema };
