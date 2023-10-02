/** @format */

import express, { Request, Response } from 'express';
import { DFrameUser } from '../../models/user.model'; // Replace with the correct import path for your model

const router = express.Router();

// PATCH /api/kyc2/:publicAddress
router.patch(
  '/api/kyc2/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;
    const {
      gender,
      country,
      state,
      city,
      street,
      doorno,
      pincode,
      dob,
      annualIncome,
      permanentAddress,
    } = req.body;

    try {
      // Find the user by their publicAddress
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update kyc2 fields
      user.kyc2 = user.kyc2 ?? {}; // Ensure kyc2 is defined
      user.kyc2.details = user.kyc2.details ?? {}; // Ensure details is defined
      user.kyc2.details.gender = gender;
      user.kyc2.details.country = country;
      user.kyc2.details.state = state;
      user.kyc2.details.city = city;
      user.kyc2.details.street = street;
      user.kyc2.details.doorno = doorno;
      user.kyc2.details.pincode = pincode;
      user.kyc2.details.dob = dob;
      user.kyc2.details.annualIncome = annualIncome;
      user.kyc2.details.permanentAddress = permanentAddress;
      user.kyc2.status = true;

      // Save the updated user
      await user.save();

      res.status(200).json(user);
    } catch (error) {
      console.error('Error updating kyc2 and user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/kyc2/:publicAddress
router.get('/api/kyc2/:publicAddress', async (req: Request, res: Response) => {
  const { publicAddress } = req.params;

  try {
    // Find the user by their publicAddress
    const user = await DFrameUser.findOne({ publicAddress });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract kyc2 details
    const kyc2Details = user.kyc2?.details || {};

    // Return user details including kyc2
    const userDetails = {
      publicAddress: user.publicAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      kyc2: {
        status: user.kyc2?.status || false,
        verified: user.kyc2?.verified || false,
        details: kyc2Details,
      },
    };

    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching kyc2 and user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/kyc2/getsubmitted
router.get('/api/kyc2/getsubmitted', async (req: Request, res: Response) => {
  try {
    // Find users with KYC2 status true but verified is false
    const users = await DFrameUser.find({
      'kyc2.status': true,
      'kyc2.verified': false,
    });

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ error: 'No users with KYC2 submitted but not verified found' });
    }

    // Extract and format user details
    const userDetails = users.map((user) => ({
      publicAddress: user.publicAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      kyc2: {
        status: user.kyc2?.status || false,
        verified: user.kyc2?.verified || false,
        details: user.kyc2?.details || {},
      },
    }));

    res.status(200).json(userDetails);
  } catch (error) {
    console.error(
      'Error fetching KYC2 submitted but not verified users:',
      error
    );
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/kyc2/getverified
router.get('/api/kyc2/getverified', async (req: Request, res: Response) => {
  try {
    // Find users with KYC2 status and verified both true
    const users = await DFrameUser.find({
      'kyc2.status': true,
      'kyc2.verified': true,
    });

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ error: 'No verified users with KYC2 found' });
    }

    // Extract and format user details
    const userDetails = users.map((user) => ({
      publicAddress: user.publicAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      kyc2: {
        status: user.kyc2?.status || false,
        verified: user.kyc2?.verified || false,
        details: user.kyc2?.details || {},
      },
    }));

    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching verified users with KYC2:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as KYC2Router };
