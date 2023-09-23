/** @format */
import express, { Request, Response } from 'express';
import { LearnMore } from '../../models/learnmore.model';
const router = express.Router();

router.get('/api/learnmore/getall', async function (req, res) {
  try {
    const learnMore = await LearnMore.find({});
    res.status(200).json(learnMore);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as LearnMoreRouter };
