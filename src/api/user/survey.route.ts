/** @format */
import express, { Request, Response } from 'express';

const router = express.Router();

import { SurveySchema } from '../../models/survey.model';

// Define the route to get the latest survey
// Define the route to get the latest verified survey
router.get('/api/getlatestSurvey', async (req, res) => {
  try {
    // Find the latest survey with a status of "verified" based on the startDate field
    const latestVerifiedSurvey = await SurveySchema.findOne({
      statusCampaign: 'verified',
    }).sort({ startDate: -1 });

    if (!latestVerifiedSurvey) {
      return res
        .status(404)
        .json({ message: 'No verified surveys found in the database' });
    }

    res.json(latestVerifiedSurvey);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define the route to update the survey status to "completed"
router.post('/api/survey/:id', async (req, res) => {
  const surveyId = req.params.id;

  try {
    // Find the survey by its ID and update its status to "completed"
    const updatedSurvey = await SurveySchema.findByIdAndUpdate(
      surveyId,
      { statusCampaign: 'completed' },
      { new: true } // To get the updated survey data
    );

    if (!updatedSurvey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    res.json({
      message: 'Survey status updated to completed',
      survey: updatedSurvey,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export { router as SurveyRouter };
