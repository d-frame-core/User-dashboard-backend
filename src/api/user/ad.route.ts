/** @format */

import { Router, Request, Response } from 'express'; // Import Express types
import Ad from '../../models/ad.models'; // Import your Mongoose model

const router = Router();

router.get(
  '/api/get-particular-ad/:id',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const foundAd = await Ad.findById(req.params.id);
      if (foundAd) {
        res.status(200).json(foundAd);
      } else {
        res.status(200).json({ message: 'No ad found' });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

export default router;

export { router as AdRouter };
