/** @format */
import express, { Request, Response } from 'express';
import { Faq } from '../../models/faq.model';
const router = express.Router();

router.get('/api/faq/getall', async function (req, res) {
  try {
    const faq = await Faq.find({});
    res.status(200).json(faq);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as FaqRouter };
