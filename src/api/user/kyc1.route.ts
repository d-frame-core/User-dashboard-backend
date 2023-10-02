/** @format */
import express, { Request, Response } from 'express';
import { DFrameUser } from '../../models/user.model'; // Replace with the correct import path for your model

const router = express.Router();
router.patch(
  '/api/kyc1/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;
    const { firstName, lastName, phoneNumber, email, userName } = req.body;

    try {
      // Find the user by their publicAddress
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update kyc1 fields
      user.kyc1 = user.kyc1 ?? {}; // Ensure kyc1 is defined
      user.kyc1.details = user.kyc1.details ?? {}; // Ensure details is defined
      user.kyc1.details.firstName = firstName;
      user.kyc1.details.lastName = lastName;
      user.kyc1.details.phoneNumber = phoneNumber;
      user.kyc1.details.email = email;
      user.kyc1.details.userName = userName;
      user.kyc1.status = true;

      // Update user model fields
      user.userName = userName;
      user.firstName = firstName;
      user.lastName = lastName;
      user.phoneNumber = phoneNumber;
      user.email = email;

      // Save the updated user
      await user.save();

      res.status(200).json(user);
    } catch (error) {
      console.error('Error updating kyc1 and user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.get('api/kyc1/:publicAddress', async (req: Request, res: Response) => {
  const { publicAddress } = req.params;

  try {
    // Find the user by their publicAddress
    const user = await DFrameUser.findOne({ publicAddress });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract kyc1 details
    const kyc1Details = user.kyc1?.details || {};

    // Return user details including kyc1
    const userDetails = {
      publicAddress: user.publicAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      kyc1: {
        status: user.kyc1?.status || false,
        verified: user.kyc1?.verified || false,
        details: kyc1Details,
      },
    };

    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching kyc1 and user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ...

// Get users with KYC1 submitted but not verified
router.get('/api/kyc1/getsubmitted', async (req: Request, res: Response) => {
  try {
    // Find users with KYC1 status true and verified false
    const users = await DFrameUser.find({
      'kyc1.status': true,
      'kyc1.verified': false,
    });

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ error: 'No users with KYC1 submitted but not verified found' });
    }

    // Extract and format user details
    const userDetails = users.map((user) => ({
      publicAddress: user.publicAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      kyc1: {
        status: user.kyc1?.status || false,
        verified: user.kyc1?.verified || false,
        details: user.kyc1?.details || {},
      },
    }));

    res.status(200).json(userDetails);
  } catch (error) {
    console.error(
      'Error fetching KYC1 submitted but not verified users:',
      error
    );
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get verified users with KYC1
router.get('/api/kyc1/getverified', async (req: Request, res: Response) => {
  try {
    // Find users with KYC1 status and verified both true
    const users = await DFrameUser.find({
      'kyc1.status': true,
      'kyc1.verified': true,
    });

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ error: 'No verified users with KYC1 found' });
    }

    // Extract and format user details
    const userDetails = users.map((user) => ({
      publicAddress: user.publicAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      kyc1: {
        status: user.kyc1?.status || false,
        verified: user.kyc1?.verified || false,
        details: user.kyc1?.details || {},
      },
    }));

    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching verified users with KYC1:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as KYC1Router };
