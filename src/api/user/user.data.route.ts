/** @format */

import express, { Request, Response } from 'express';
import { DFrameUser } from '../../models/user.model';

const router = express.Router();

// POST /api/user-data/:publicAddress
router.post(
  '/api/user-data/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;
    const dataToAdd = req.body;

    try {
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Ensure user.userData is defined or initialize it as an empty array
      user.userData = user.userData || [];

      // Check if the user already has userData for the provided dataDate
      const existingUserData = user.userData.find(
        (data) => data.dataDate === dataToAdd.dataDate
      );

      if (existingUserData) {
        // If data for the same date exists, update it
        const existingUrlIndex = existingUserData.urlData.findIndex(
          (url) => url.urlLink === dataToAdd.urlData.urlLink
        );

        if (existingUrlIndex !== -1) {
          // Url already exists, so just push new timestamp
          existingUserData.urlData[existingUrlIndex].timestamps.push(
            ...dataToAdd.urlData.timestamps
          );
        } else {
          // Url doesn't exist yet, so add new entry
          existingUserData.urlData.push(dataToAdd.urlData);
        }
      } else {
        console.log('Adding new data for a new date');
        // Add a new entry for a new date
        user.userData.push(dataToAdd);
      }

      await user.save();

      res.status(200).json(user);
    } catch (error) {
      console.error('Error adding user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/user-data/:publicAddress
router.get(
  '/api/user-data/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;

    try {
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Ensure user.userData is defined or initialize it as an empty array
      user.userData = user.userData || [];

      res.status(200).json(user.userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/user-data/:publicAddress
router.delete(
  '/api/user-data/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;

    try {
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Ensure user.userData is defined or initialize it as an empty array
      user.userData = user.userData || [];

      // Clear userData for the user
      user.userData = [];

      await user.save();

      res.status(200).json(user);
    } catch (error) {
      console.error('Error deleting user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/user-data/specific/:publicAddress
router.get(
  '/api/user-data/specific/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;
    const { date } = req.body;

    try {
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Ensure user.userData is defined or initialize it as an empty array
      user.userData = user.userData || [];

      const userDataForDate = user.userData.find(
        (data) => data.dataDate === date
      );

      if (!userDataForDate) {
        return res
          .status(404)
          .json({ error: 'User data not found for the specified date' });
      }

      res.status(200).json(userDataForDate);
    } catch (error) {
      console.error('Error fetching specific user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/user-data/specific/:publicAddress
router.delete(
  '/api/user-data/specific/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;
    const { date } = req.body;

    try {
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Ensure user.userData is defined or initialize it as an empty array
      user.userData = user.userData || [];

      const userDataIndex = user.userData.findIndex(
        (data) => data.dataDate === date
      );

      if (userDataIndex === -1) {
        return res
          .status(404)
          .json({ error: 'User data not found for the specified date' });
      }

      // Remove the userData for the specified date
      user.userData.splice(userDataIndex, 1);

      await user.save();

      res.status(200).json(user);
    } catch (error) {
      console.error('Error deleting specific user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export { router as UserDataRouter };
