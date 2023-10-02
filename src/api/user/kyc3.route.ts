/** @format */

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { DFrameUser } from '../../models/user.model'; // Replace with the correct import path for your model
import { Kyc3 } from '../../models/kyc3.model';

const router = express.Router();

// Define the directory where images will be stored
const imageDirectory = path.join(__dirname, '../', '../', '../', 'uploads'); // Adjust the path as needed

// Create a storage engine using multer for uploading images
const storage = multer.diskStorage({
  destination: imageDirectory, // Specify the directory where images will be saved
  filename: (req, file, cb) => {
    // Generate a unique filename for each uploaded image
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${fileExtension}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// PATCH /api/kyc/:publicAddress - Upload address images and update user model
router.post(
  '/api/kyc/:publicAddress',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'governmentProof1', maxCount: 1 },
    { name: 'governmentProof2', maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;

    console.log('ENTERED');
    try {
      // Find or create the address entry by publicAddress
      let kyc = await Kyc3.findOne({ publicAddress });
      console.log(kyc);
      if (!kyc) {
        kyc = new Kyc3({ publicAddress });
      }

      // Check if addressProof1 and addressProof2 files exist in the request
      if (
        !req.files ||
        !(req as any).files['governmentProof1'] ||
        !(req as any).files['governmentProof2'] ||
        !(req as any).files['photo']
      ) {
        return res.status(400).json({
          error: 'Both addressProof1 and addressProof2 images are required',
        });
      }

      // Get the path of the uploaded images and their content types
      const governmentProof1 = (req as any).files['governmentProof1'][0];
      const governmentProof2 = (req as any).files['governmentProof2'][0];
      const photo = (req as any).files['photo'][0];

      // Check if addressProof1 and addressProof2 files exist in the request
      if (!governmentProof1 || !governmentProof2 || !photo) {
        return res.status(400).json({
          error: 'Both addressProof1 and addressProof2 images are required',
        });
      }

      // Update the address with the image data and content types
      kyc.governmentProof1.data = governmentProof1.buffer;
      kyc.governmentProof1.contentType = governmentProof1.mimetype;
      kyc.governmentProof2.data = governmentProof2.buffer;
      kyc.governmentProof2.contentType = governmentProof2.mimetype;
      kyc.photo.data = photo.buffer;
      kyc.photo.contentType = photo.mimetype;
      kyc.publicAddress = publicAddress;

      // Save the updated address
      await kyc.save();

      // Update user model with address data if it exists in req.body
      const user = await DFrameUser.findOne({ publicAddress });

      if (user) {
        if (user.kyc3) {
          user.kyc3.status = true;
        }

        await user.save();
      }

      res.status(200).json({
        message: 'KYC images uploaded successfully',
        data: kyc,
      });
    } catch (error) {
      console.error('Error uploading address images:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/kyc2/getsubmitted
router.get('/api/kyc3/getsubmitted', async (req: Request, res: Response) => {
  try {
    // Find users with KYC2 status true but verified is false
    const users = await DFrameUser.find({
      'kyc3.status': true,
      'kyc3.verified': false,
    });

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ error: 'No users with KYC3 submitted but not verified found' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(
      'Error fetching KYC2 submitted but not verified users:',
      error
    );
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/kyc3/getverified
router.get('/api/kyc3/getverified', async (req: Request, res: Response) => {
  try {
    // Find users with KYC2 status and verified both true
    const users = await DFrameUser.find({
      'kyc3.status': true,
      'kyc3.verified': true,
    });

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ error: 'No verified users with KYC2 found' });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching verified users with KYC2:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as KYC3Router };
