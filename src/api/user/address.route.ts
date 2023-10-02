/** @format */

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

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

// Load your models
import { Address } from '../../models/address.model'; // Update the import path as needed
import { DFrameUser } from '../../models/user.model'; // Update the import path as needed

// PATCH /api/address/:publicAddress - Upload address images and update user model
router.patch(
  '/api/address/:publicAddress',
  upload.fields([
    { name: 'addressProof1', maxCount: 1 },
    { name: 'addressProof2', maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;

    console.log('ENTERED');
    try {
      // Find or create the address entry by publicAddress
      let address = await Address.findOne({ publicAddress });
      console.log(address);
      if (!address) {
        address = new Address({ publicAddress });
      }

      // Check if addressProof1 and addressProof2 files exist in the request
      if (
        !req.files ||
        !(req as any).files['addressProof1'] ||
        !(req as any).files['addressProof2']
      ) {
        return res.status(400).json({
          error: 'Both addressProof1 and addressProof2 images are required',
        });
      }

      // Get the path of the uploaded images and their content types
      const addressProof1 = (req as any).files['addressProof1'][0];
      const addressProof2 = (req as any).files['addressProof2'][0];

      // Check if addressProof1 and addressProof2 files exist in the request
      if (!addressProof1 || !addressProof2) {
        return res.status(400).json({
          error: 'Both addressProof1 and addressProof2 images are required',
        });
      }

      // Update the address with the image data and content types
      address.addressProof1.data = addressProof1.buffer;
      address.addressProof1.contentType = addressProof1.mimetype;
      address.addressProof2.data = addressProof2.buffer;
      address.addressProof2.contentType = addressProof2.mimetype;
      address.publicAddress = publicAddress;

      // Save the updated address
      await address.save();

      // Update user model with address data if it exists in req.body
      const user = await DFrameUser.findOne({ publicAddress });

      if (user) {
        if (req.body.address1) {
          (user.address1 as any).data = req.body.address1;
          (user.address1 as any).submitted = true;
        }
        if (req.body.address2) {
          (user.address2 as any).data = req.body.address2;
          (user.address2 as any).submitted = true;
        }

        await user.save();
      }

      res.status(200).json({
        message: 'Address images uploaded successfully',
        data: address,
      });
    } catch (error) {
      console.error('Error uploading address images:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// ... (Previous code)

// PATCH /admin/api/address/verify/:publicAddress - Verify address for a user
router.patch(
  '/admin/api/address/verify/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;

    try {
      // Find the address by publicAddress
      const address = await Address.findOne({ publicAddress });

      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }

      // Check if addressProof1 and addressProof2 data exist
      if (!address.addressProof1 || !address.addressProof2) {
        return res.status(400).json({ error: 'Address images not found' });
      }

      // Update user model for the publicAddress
      const user = await DFrameUser.findOne({ publicAddress });

      if (user) {
        (user.address1 as any).verified = true; // Update the verification status as needed
        (user.address2 as any).verified = true; // Update the verification status as needed

        await user.save();
      }

      res.status(200).json({ message: 'Address verified successfully' });
    } catch (error) {
      console.error('Error verifying address:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export { router as AddressRouter };
