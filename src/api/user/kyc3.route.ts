/** @format */

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { DFrameUser } from '../../models/user.model'; // Replace with the correct import path for your model

const router = express.Router();

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads'); // Upload files to the 'uploads' folder
  },
  filename: (req, file, callback) => {
    // Generate a unique filename based on the current timestamp and file extension
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// PATCH /api/kyc3/:publicAddress
router.patch(
  '/api/kyc3/:publicAddress',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'governmentId1', maxCount: 1 },
    { name: 'governmentId2', maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;
    const { photo, governmentId1, governmentId2 } = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    try {
      // Find the user by their publicAddress
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update kyc3 fields
      user.kyc3 = user.kyc3 ?? {}; // Ensure kyc3 is defined
      user.kyc3.details = user.kyc3.details ?? {}; // Ensure details is defined

      // Store the image URLs in the user's kyc3 details
      if (photo && photo.length > 0) {
        user.kyc3.details.photoUrl = `/uploads/${photo[0].filename}`;
      }
      if (governmentId1 && governmentId1.length > 0) {
        user.kyc3.details.governmentId1Url = `/uploads/${governmentId1[0].filename}`;
      }
      if (governmentId2 && governmentId2.length > 0) {
        user.kyc3.details.governmentId2Url = `/uploads/${governmentId2[0].filename}`;
      }

      // Save the updated user
      await user.save();

      res.status(200).json(user);
    } catch (error) {
      console.error('Error updating kyc3 and user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/kyc3/:publicAddress
router.get('/api/kyc3/:publicAddress', async (req: Request, res: Response) => {
  const { publicAddress } = req.params;

  try {
    // Find the user by their publicAddress
    const user = await DFrameUser.findOne({ publicAddress });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract kyc3 details
    const kyc3Details = user.kyc3?.details || {};

    // Return user details including kyc3
    const userDetails = {
      publicAddress: user.publicAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      kyc3: {
        status: user.kyc3?.status || false,
        verified: user.kyc3?.verified || false,
        details: kyc3Details,
      },
    };

    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching kyc3 and user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as KYC3Router };
