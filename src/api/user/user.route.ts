/** @format */

import express, { Request, Response } from 'express';
import { User } from '../../models/user.model';
import { User_data } from '../../models/user-data.model';
// import { User } from '../../models/user.data';
// import { Kafka } from 'kafkajs';
import { Magic, SDKError } from '@magic-sdk/admin';
import mongoose from 'mongoose';
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

/* POST USER DATA IN DATABASE */
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

/* CHECK IF USER EXISTS IN DATABASE */
router.get('/api/users/detail/:publicAddress', async (req, res) => {
  const { publicAddress } = req.params;
  try {
    const user = await User.findOne({ publicAddress: String(publicAddress) });
    if (user) {
      return res.status(200).send({ message: 'User exists', data: user });
    } else {
      return res.status(404).send({ message: 'User does not exist' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server error' });
  }
});

/* ADDING USER DATA to MONGODB */
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
// router.post('/api/users/userdata', async (req, res) => {
//   console.log('Handler called');

//   const id = req.body.publicAddress;
//   const newUserData = req.body.data;

//   try {
//     const user = await User.findOne({ publicAddress: String(id) });

//     console.log('User fetched');

//     if (!user) {
//       return res.status(404).send('User not found');
//     }

//     const newDate = newUserData.dataDate;

//     console.log('New date:', newDate);

//     let existingDataIndex = -1;

//     for (let i = 0; i < user.userData.length; i++) {
//       console.log('Comparing date:', user.userData[i].dataDate);

//       if (user.userData[i].dataDate === newDate) {
//         existingDataIndex = i;
//         break;
//       }
//     }

//     if (existingDataIndex !== -1) {
//       console.log('Existing data found at index:', existingDataIndex);

//       const existingUrlIndex = user.userData[
//         existingDataIndex
//       ].urlData.findIndex((url) => url.urlLink === newUserData.urlData.urlLink);

//       if (existingUrlIndex !== -1) {
//         console.log('Existing URL found at index:', existingUrlIndex);

//         const existingTime =
//           user.userData[existingDataIndex].urlData[
//             existingUrlIndex
//           ].timestamps[0].getTime();

//         const newTime = new Date(newUserData.urlData.timestamps[0]).getTime();

//         if (existingTime === newTime) {
//           console.log('Same time, pushing new timestamp');
//           user.userData[existingDataIndex].urlData[
//             existingUrlIndex
//           ].timestamps.push(newUserData.urlData.timestamps[0]);
//         } else {
//           console.log('Different time, skipping');
//         }
//       } else {
//         console.log('URL not found, adding new entry');
//         user.userData[existingDataIndex].urlData.push(newUserData.urlData);
//       }
//     } else {
//       console.log('New date, adding new data');
//       user.userData.push(newUserData);
//     }

//     await user.save();

//     console.log('User updated successfully');

//     res.send(user);
//   } catch (err) {
//     console.error('Error updating user', err);
//     res.status(500).send('Error updating user data');
//   }
// });

/* DELETING USER FROM BACKEND */
router.delete('/api/users/delete', async (req, res) => {
  const publicAddress = req.body.publicAddress;
  try {
    const user = await User.findOne({ publicAddress: String(publicAddress) });

    if (!user) {
      return res.status(404).send('User not found');
    }

    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* GET USER DATA OF SPECIFIC DATE */
router.get('/api/users/userdata/specific', async (req, res) => {
  const { publicAddress, date } = req.body;

  try {
    const user = await User.findOne({ publicAddress });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // dataDate is string
    const data = user.userData.filter((d) => {
      return d.dataDate === date;
    });

    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting user data');
  }
});

/* DELETE ALL USER DATA OF GIVEN ADDRESS */
router.delete('/api/users/userdata/delete', async (req, res) => {
  const { publicAddress } = req.body;

  try {
    const user = await User.findOne({ publicAddress });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Set userData to empty array
    user.userData = [];

    await user.save();

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user data');
  }
});

/* DELETE USER DATA OF A SPECIFIC DATE */
router.delete('/api/users/userdata/specific', async (req, res) => {
  const { publicAddress, date } = req.body;

  try {
    const user = await User.findOne({ publicAddress });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const dataIndex = user.userData.findIndex((d) => d.dataDate === date);

    if (dataIndex === -1) {
      return res.status(404).json({ message: 'No data for given date' });
    }

    user.userData.splice(dataIndex, 1);

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* UPDATE DETAILS OF A USER  */
router.patch('/api/users/detail/:publicAddress', async (req, res) => {
  const { publicAddress } = req.params;
  const updatedUserData = req.body;

  try {
    // Find the user by publicAddress
    const user = await User.findOne({ publicAddress: String(publicAddress) });

    if (!user) {
      return res.status(404).send({ message: 'User does not exist' });
    }

    // Update the user data
    user.set(updatedUserData);
    await user.save();

    return res.status(200).send({ message: 'User data updated', data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server error' });
  }
});

export { router as userRouter };

// id:- 650c371352874b3ec01c8df7
