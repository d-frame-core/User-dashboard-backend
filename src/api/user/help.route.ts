/** @format */
import express, { Request, Response } from 'express';
import { Help } from '../../models/help.model';
const router = express.Router();

router.get('/api/help/getall', async function (req, res) {
  try {
    const help = await Help.find({});
    res.status(200).json(help);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as HelpRouter };
