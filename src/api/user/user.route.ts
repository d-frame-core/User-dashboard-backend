/** @format */

import express, { Request, Response } from 'express';
import { User } from '../../models/user.model';
import { User_data } from '../../models/user-data.model';
// import { User } from '../../models/user.data';
// import { Kafka } from 'kafkajs';
import { Magic, SDKError } from '@magic-sdk/admin';
import * as crypto from 'crypto';

const router = express.Router();

// const kafka = new Kafka({
// 	clientId: 'my-app',
// 	brokers: [process.env.KAFKA_HOST],
//   })

router.get('/api/user/update-email', async (req: Request, res: Response) => {
  let email = req.query.email;
  const magic = new Magic(process.env.MAGIC_SECRET_KEY);
  if (req.headers && req.headers.authorization) {
    const DIDToken = req.headers.authorization.substring(7);
    try {
      const metadata = await magic.users.getMetadataByToken(DIDToken);
      console.log(metadata);
      let user = await User.updateOne(
        { publicKey: String(metadata.publicAddress) },
        { email: String(email) }
      );
      res.send(user);
    } catch (err) {
      if (err instanceof SDKError) {
        console.log(err);
      }
    }
  } else {
    res.status(404).send('User not found');
  }
});

router.post('/api/user/profileData', async (req: Request, res: Response) => {
  const magic = new Magic(process.env.MAGIC_SECRET_KEY);
  let data = req.body;
  console.log(req.body);
  if (req.headers && req.headers.authorization) {
    const DIDToken = req.headers.authorization.substring(7);
    try {
      const metadata = await magic.users.getMetadataByToken(DIDToken);
      console.log(metadata);
      let dataCheck = await User_data.findOne({
        publicKey: String(metadata.publicAddress),
      });
      if (!dataCheck) {
        let mongoData = await User_data.create(data);
        console.log(mongoData);
        res.send({ data: mongoData });
      } else {
        let profileData = await User_data.findOneAndUpdate(
          { publicKey: String(metadata.publicAddress) },
          data
        );
        res.send({ data: profileData });
      }
    } catch (err) {
      if (err instanceof SDKError) {
        console.log(err);
      }
    }
  } else {
    res.status(404).send('User not found');
  }
});

router.post(
  '/api/user/updateProfileData/:publicAddress',
  async (req: Request, res: Response) => {
    const magic = new Magic(process.env.MAGIC_SECRET_KEY);
    let datas = req.body;
    // console.log(req.body);
    // if (req.headers && req.headers.authorization) {
    // 	const DIDToken = req.headers.authorization.substring(7);
    try {
      // const metadata = await magic.users.getMetadataByToken(DIDToken);
      // console.log(metadata);
      let dataCheck = await User.findOne({
        publicAddress: String(datas.publicAddress),
      });
      console.log('dataCheck', dataCheck);
      if (dataCheck == null || undefined) {
        console.log('If called datacheck');
        const initVector = crypto.randomBytes(32).toString('base64');
        const securityKey = crypto.randomBytes(32).toString('base64');
        try {
          let mongoData = await User.create(datas);
          console.log('mongoData', mongoData);
          res.send({ data: mongoData });
        } catch (error) {
          console.log(error);
        }
      } else {
        let profileData = await User.findOneAndUpdate(
          { publicAddress: String(datas.publicAddress) },
          datas,
          { useFindAndModify: false }
        );
        res.send({ data: profileData });
      }
    } catch (err) {
      if (err instanceof SDKError) {
        console.log(err);
      }
    }
    // } else {
    //     res.status(404).send("User not found")
    // }
  }
);

router.get(
  '/api/user/updateProfileData/:publicAddress',
  async (req: Request, res: Response) => {
    const magic = new Magic(process.env.MAGIC_SECRET_KEY);
    const userPublicAddress = req.params.publicAddress;
    console.log(userPublicAddress);
    try {
      let dataCheck = await User.findOne({
        publicAddress: String(userPublicAddress),
      });
      if (dataCheck) {
        console.log(dataCheck);
        res.send(dataCheck);
      } else {
        console.log('Please Update your details');
      }
    } catch (err) {
      if (err instanceof SDKError) {
        console.log(err);
      }
    }
  }
);

// user.routes.ts

router.post('/api/users/userdata', async (req, res) => {
  console.log('Called this');
  const id = req.body.publicAddress;
  const newUserData = req.body.data;
  try {
    const user = await User.findOne({ publicAddress: String(id) });

    if (!user) {
      console.log('404 not found');
      return res.status(404).send('User not found');
    }

    console.log('Checking for existing data on the same date');
    let existingDataIndex = -1;

    for (let i = 0; i < user.userData.length; i++) {
      if (user.userData[i].dataDate === newUserData.dataDate) {
        existingDataIndex = i;
        break;
      }
    }

    if (existingDataIndex !== -1) {
      console.log('Updating existing data');
      const existingUrlIndex = user.userData[
        existingDataIndex
      ].urlData.findIndex((url) => url.urlLink === newUserData.urlData.urlLink);

      if (existingUrlIndex !== -1) {
        // Url already exists, so just push new timestamp
        user.userData[existingDataIndex].urlData[
          existingUrlIndex
        ].timestamps.push(newUserData.urlData.timestamps[0]);
      } else {
        // Url doesn't exist yet, so add new entry
        user.userData[existingDataIndex].urlData.push(newUserData.urlData);
      }
    } else {
      console.log('Adding new data for a new date');
      // Add a new entry for a new date
      user.userData.push(newUserData);
    }

    await user.save();

    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating user data');
  }
});

// Delete user route
router.delete('/api/users', async (req, res) => {
  const publicAddress = req.body.publicAddress;

  try {
    // Find the user by publicAddress
    const user = await User.findOne({ publicAddress });

    // If no user, return 404
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();

    // Return success response
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export { router as userRouter };

// id:- 650c371352874b3ec01c8df7
