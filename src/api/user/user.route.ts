/** @format */

import express, { Request, Response } from 'express';
import { DFrameUser } from '../../models/user.model'; // Replace with the correct import path for your model

const router = express.Router();
import jwt, { Secret } from 'jsonwebtoken';

import 'dotenv/config';
const jwtSecret: Secret | undefined = process.env.JWT_SECRET || 'defaultSecret';
console.log(jwtSecret);
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}
// POST /api/signup/:publicAddress
router.post(
  '/api/signup/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;

    try {
      // Check if a user with the provided publicAddress already exists
      const existingUser = await DFrameUser.findOne({ publicAddress });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create a new user with only the publicAddress field
      const newUser = new DFrameUser({
        publicAddress,
      });

      // Save the new user to the database
      await newUser.save();

      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/get/:publicAddress
router.get('/api/get/:publicAddress', async (req: Request, res: Response) => {
  const { publicAddress } = req.params;

  try {
    // Find the user by their publicAddress
    const user = await DFrameUser.findOne({ publicAddress });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const expiresIn = 30 * 24 * 60 * 60; // 30 days * 24 hours * 60 minutes * 60 seconds

    // Generate a JWT token with a 30-day expiration
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn,
    });

    res.status(200).json({ user, token });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch(
  '/api/referral/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;
    const { referral } = req.body;

    try {
      // Find the user by their publicAddress
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.referrals = referral;
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/users/getall
router.get('/api/users/getall', async (req: Request, res: Response) => {
  try {
    // Retrieve all users from the database
    const users = await DFrameUser.find();

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/delete/:publicAddress
router.delete(
  '/api/delete/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;

    try {
      // Find the user by their publicAddress and delete it
      const deletedUser = await DFrameUser.findOneAndDelete({ publicAddress });

      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/delete/all
router.delete('/api/delete/all', async (req: Request, res: Response) => {
  try {
    // Delete all users in the database
    await DFrameUser.deleteMany({});

    res.status(200).json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.error('Error deleting all users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as UserRouter };
