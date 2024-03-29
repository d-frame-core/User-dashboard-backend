/** @format */

import express, { Request, Response } from 'express';
import { DFrameUser, KYCStatus } from '../../models/user.model'; // Replace with the correct import path for your model

import path from 'path';
import fs from 'fs';
import multer from 'multer';
import jwt, { Secret, sign } from 'jsonwebtoken';

import 'dotenv/config';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = function (req: any, file: any, cb: any) {
  // Accept only image files
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fieldSize: 25 * 1024 * 1024 },
});

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

router.get('/api/users', async (req, res) => {
  try {
    const users = await DFrameUser.find().exec();

    if (!users) {
      return res.status(404).json({ message: 'No users found' });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.post('/api/user/:publicAddress', async (req, res) => {
  try {
    const publicAddress = req.params.publicAddress;
    const userData = req.body;

    // Check if the user already exists with the given publicAddress
    const existingUser = await DFrameUser.findOne({ publicAddress });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user based on the provided data
    const newUser = new DFrameUser(userData.user);

    // Save the user to the database
    await newUser.save();

    // Create a JWT token with user information
    const jwtPayload = {
      userId: newUser._id, // Assuming your user model has an "_id" field
    };

    const jwtSecret = process.env.JWT_SECRET; // Ensure you have JWT_SECRET in your environment variables

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // Sign the JWT token
    const token = jwt.sign(jwtPayload, jwtSecret);

    // Return the user details and token in the response
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/api/user/:publicAddress', async (req: Request, res: Response) => {
  try {
    const publicAddress = req.params.publicAddress;

    // Find the user by public address in the database
    const user = await DFrameUser.findOne({ publicAddress });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Create and sign a JWT token with user information
    const jwtPayload = {
      userId: user.id, // You can include any user-related data here
    };

    const jwtSecret: string | undefined = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // Sign the JWT token
    const token = sign(jwtPayload, jwtSecret);
    // Return the user details
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /api/user/:publicAddress
router.delete(
  '/api/user/:publicAddress',
  async (req: Request, res: Response) => {
    try {
      const publicAddress = req.params.publicAddress;

      // Find the user by public address and delete it from the database
      const deletedUser = await DFrameUser.findOneAndDelete({ publicAddress });

      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return a success message
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// PATCH /api/referral/:publicAddress
router.patch(
  '/api/referral/:publicAddress',
  async (req: Request, res: Response) => {
    try {
      const publicAddress = req.params.publicAddress;
      const { referralCode } = req.body;

      // Find the user by public address
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update the referralCode
      user.referralCode = referralCode;

      // Save the updated user
      await user.save();

      // Return the updated user
      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);
// PATCH /api/kyc1/:publicAddress
router.patch(
  '/api/kyc1/:publicAddress',
  async (req: Request, res: Response) => {
    try {
      const publicAddress = req.params.publicAddress;
      const { firstName, lastName, userName, phoneNumber, email } = req.body;

      // Find the user by public address
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Ensure kyc1 is defined
      user.kyc1 = user.kyc1 ?? {};

      // Ensure details is defined
      user.kyc1.details = user.kyc1.details ?? {};

      // Update KYC1 details
      user.kyc1.details.firstName = firstName;
      user.kyc1.details.lastName = lastName;
      user.kyc1.details.userName = userName;
      user.kyc1.details.phoneNumber = phoneNumber;
      user.kyc1.details.email = email;

      // Update KYC1 status to true
      user.kyc1.status = KYCStatus.Unverified;

      // Save the updated user
      await user.save();

      // Return the updated user
      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// PATCH /api/kyc2/:publicAddress
router.patch(
  '/api/kyc2/:publicAddress',
  async (req: Request, res: Response) => {
    try {
      const publicAddress = req.params.publicAddress;
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
      } = req.body;

      // Find the user by public address
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Ensure kyc2 is defined
      user.kyc2 = user.kyc2 ?? {};

      // Ensure details is defined
      user.kyc2.details = user.kyc2.details ?? {};

      // Update KYC2 details
      user.kyc2.details.gender = gender;
      user.kyc2.details.country = country;
      user.kyc2.details.state = state;
      user.kyc2.details.city = city;
      user.kyc2.details.street = street;
      user.kyc2.details.doorno = doorno;
      user.kyc2.details.pincode = pincode;
      user.kyc2.details.dob = dob;
      user.kyc2.details.annualIncome = annualIncome;
      // Update KYC2 status to true
      user.kyc2.status = KYCStatus.Unverified;

      // Save the updated user
      await user.save();

      // Return the updated user
      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// PATCH /api/permissions/:publicAddress
router.patch(
  '/api/permissions/:publicAddress',
  async (req: Request, res: Response) => {
    try {
      const publicAddress = req.params.publicAddress;
      const {
        location,
        cookies,
        callDataSharing,
        emailSharing,
        notification,
        storageOption,
      } = req.body;

      // Find the user by public address
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update permissions using optional chaining
      (user.permissions as any) = user.permissions || {};
      (user.permissions as any).location = location;
      (user.permissions as any).cookies = cookies;
      (user.permissions as any).callDataSharing = callDataSharing;
      (user.permissions as any).emailSharing = emailSharing;
      (user.permissions as any).notification = notification;
      (user.permissions as any).storageOption = storageOption;

      // Save the updated user
      await user.save();

      // Return the updated user
      return res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// PATCH /api/image/:publicAddress
router.patch(
  '/api/image/:publicAddress',
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      const publicAddress = req.params.publicAddress;

      // Find the user by public address
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (req.file) {
        // Delete the previous image if it exists
        if (user.profileImage && user.profileImage.data) {
          const previousImageFileName = `${publicAddress}.${user.profileImage.contentType.replace(
            'image/',
            ''
          )}`;
          const previousImagePath = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            'profile',
            previousImageFileName
          );

          fs.unlink(previousImagePath, async (err) => {
            if (err) {
              console.log(err);
              return res.status(400).json({ error: err });
            }

            // Update the profile with the new image data
            (user.profileImage as any).data = (req.file as any).buffer;
            (user.profileImage as any).contentType = (req.file as any).mimetype;

            // Save the updated user
            await user.save();

            // Generate URL for the uploaded image
            const extension = path.extname((req.file as any).originalname);
            const imageName = `${publicAddress}${extension}`;
            const imageUrl = `${req.protocol}://${req.get(
              'host'
            )}/uploads/profile/${imageName}`;

            // Rename the uploaded file with _id
            const newImagePath = path.join(
              __dirname,
              '..',
              '..',
              '..',
              'uploads',
              'profile',
              imageName
            );
            console.log('if rename');
            fs.renameSync((req.file as any).path, newImagePath);

            console.log('Image uploaded successfully. URL:', imageUrl);
            return res.status(200).json({
              message: 'Profile picture updated successfully',
              data: { imageUrl },
            });
          });
        } else {
          // Update the profile with the new image data if no previous image exists
          user.profileImage = {
            data: (req.file as any).buffer,
            contentType: (req.file as any).mimetype,
          };

          // Save the updated user
          await user.save();

          // Generate URL for the uploaded image
          const extension = path.extname(req.file.originalname);
          const imageName = `${publicAddress}${extension}`;
          const imageUrl = `${req.protocol}://${req.get(
            'host'
          )}/uploads/profile/${imageName}`;

          // Rename the uploaded file with _id
          const newImagePath = path.join(
            __dirname,
            '..',
            '..',
            '..',
            'uploads',
            'profile',
            imageName
          );
          console.log('else rename');
          fs.renameSync(req.file.path, newImagePath);

          console.log('Image uploaded successfully. URL:', imageUrl);
          return res.status(200).json({
            message: 'Profile picture updated successfully',
            data: { imageUrl },
          });
        }
      } else {
        return res.status(400).json({ error: 'No file uploaded' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// GET /api/image/:publicAddress
router.get('/api/image/:publicAddress', async (req, res) => {
  try {
    const publicAddress = req.params.publicAddress;

    // Find the user by public address
    const user = await DFrameUser.findOne({ publicAddress });

    if (!user || !user.profileImage) {
      // If the user doesn't exist or has no profile image data, return a 404 error
      return res.status(404).json({ error: 'Profile image not found' });
    }

    // Set the response content type to "image/jpeg"
    res.contentType('image/jpeg');

    // Construct the file path for the user's profile image
    const extension = user.profileImage.contentType.replace('image/', '');
    const imagePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      'profile',
      `${publicAddress}.${extension}`
    );

    // Read the profile image file and send it as a response
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        if (err.code == 'ENOENT') {
          const imagePath = path.join(
            __dirname,
            '..',
            '..',
            '..',
            'uploads',
            'profile',
            `${publicAddress}.jpg`
          );

          fs.readFile(imagePath, (err, data) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.end(data);
          });
        } else {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      }
      res.end(data);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/address/:publicAddress
router.post(
  '/api/address/:publicAddress',
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      const publicAddress = req.params.publicAddress;

      // Find the user by public address
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Handle the image upload
      if (req.file) {
        // Construct the image path and filename
        const extension = path.extname(req.file.originalname);
        const imageName = `${publicAddress}${extension}`;
        const imagePath = path.join(
          __dirname,
          '..',
          '..',
          '..',
          'uploads',
          'address',
          imageName
        );

        // Read the uploaded image file and store it in the user's addressProof
        fs.readFile(req.file.path, (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal Server Error' });
          }

          // Update user's address data
          user.address = {
            data: req.body.data || '',
            submitted: true,
            addressProof: {
              data,
              contentType: (req.file as any).mimetype,
            },
          };

          // Save the updated user
          user.save((saveErr) => {
            if (saveErr) {
              console.error(saveErr);
              return res.status(500).json({ message: 'Internal Server Error' });
            }

            // Rename and move the uploaded file
            fs.renameSync((req.file as any).path, imagePath);

            console.log('Address submitted successfully.');
            return res
              .status(200)
              .json({ message: 'Address submitted successfully' });
          });
        });
      } else {
        return res.status(400).json({ error: 'No file uploaded' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

router.get('/api/token/:publicAddress', async (req: Request, res: Response) => {
  try {
    const publicAddress = req.params.publicAddress;

    // Find the user by public address in the database
    const user = await DFrameUser.findOne({ publicAddress });

    if (!user) {
      // If the user doesn't exist, return null
      return res.status(200).json({ token: null });
    }

    // Create and sign a JWT token with user information
    const jwtPayload = {
      userId: user.id, // You can include any user-related data here
    };

    const jwtSecret: string | undefined = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // Sign the JWT token
    const token = sign(jwtPayload, jwtSecret);

    // Return the token
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Function to check if the content type is valid
function isValidContentType(contentType: string): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  return allowedTypes.includes(contentType);
}
// PATCH /api/kyc3/:publicAddress
router.patch(
  '/api/kyc3/:publicAddress',
  upload.fields([
    { name: 'governmentProof1', maxCount: 1 },
    { name: 'governmentProof2', maxCount: 1 },
    { name: 'userPhoto', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const publicAddress = req.params.publicAddress;

      // Find the user by public address
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      type UploadedFiles = { [fieldname: string]: Express.Multer.File[] };

      // ...

      // Inside your route handler
      const uploadedFiles: UploadedFiles = req.files as UploadedFiles; // Annotate the type here

      // Check if all three images were uploaded
      const governmentProof1 = uploadedFiles['governmentProof1'][0];
      const governmentProof2 = uploadedFiles['governmentProof2'][0];
      const userPhoto = uploadedFiles['userPhoto'][0];

      if (
        !isValidContentType(governmentProof1.mimetype) ||
        !isValidContentType(governmentProof2.mimetype) ||
        !isValidContentType(userPhoto.mimetype)
      ) {
        return res.status(400).json({
          error:
            'Invalid file type. Supported types: image/jpeg, image/png, image/jpg',
        });
      }

      // ...

      if (!governmentProof1 || !governmentProof2 || !userPhoto) {
        return res.status(400).json({ error: 'All three images are required' });
      }

      // Define the image paths for all three images
      const imagePath1 = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        'kyc3',
        `${publicAddress}-governmentProof1${path.extname(
          governmentProof1.originalname
        )}`
      );
      const imagePath2 = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        'kyc3',
        `${publicAddress}-governmentProof2${path.extname(
          governmentProof2.originalname
        )}`
      );
      const imagePath3 = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        'kyc3',
        `${publicAddress}-userPhoto${path.extname(userPhoto.originalname)}`
      );

      // Check the values of variables used to construct file paths
      console.log('imagePath1:', imagePath1);
      console.log('imagePath2:', imagePath2);
      console.log('imagePath3:', imagePath3);

      // Rename and move the uploaded files
      fs.renameSync(governmentProof1.path, imagePath1);
      fs.renameSync(governmentProof2.path, imagePath2);
      fs.renameSync(userPhoto.path, imagePath3);

      // Update KYC information
      user.kyc3 = {
        status: KYCStatus.Unverified, // Set status to 'unverified' as a string,
        governmentProof1: {
          data: (governmentProof1 as any).buffer,
          contentType: (governmentProof1 as any).mimetype,
        },
        governmentProof2: {
          data: (governmentProof2 as any).buffer,
          contentType: (governmentProof2 as any).mimetype,
        },
        userPhoto: {
          data: (userPhoto as any).buffer,
          contentType: (userPhoto as any).mimetype,
        },
      };

      // Save the updated user
      await user.save();

      console.log('KYC information updated successfully.');
      return res
        .status(200)
        .json({ message: 'KYC information updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);
// POST /api/user-data/:publicAddress
router.post(
  '/api/user-data/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;
    const dataEntries: any[] = req.body.tabData; // Array of data entries
    console.log('dataEntries stores below');
    console.log(typeof dataEntries);
    console.log(dataEntries);
    try {
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Define currentDate in localeDateString('en-GB') format
      const currentDate = new Date().toLocaleDateString('en-GB');

      // Define static tags
      const staticTags = ['dframe', 'web3'];

      // Iterate through the array of data entries
      if (dataEntries.length < 1) {
        return res.status(200).send('No data entries found');
      }
      for (const entry of dataEntries) {
        const { urlLink, properties } = entry;
        const { timeStamp, time_on_site } = properties;

        // Convert the received timestamp to localeTimeString('en-GB')
        const localeTimeString = new Date(timeStamp).toLocaleTimeString(
          'en-GB'
        );

        // Convert time_spent to a number
        const parsedTimeSpent = parseFloat(time_on_site);

        // Check if the user already has userData for the currentDate
        const existingUserData = (user as any).userData.find(
          (data: any) => data.dataDate === currentDate
        );

        if (existingUserData) {
          // If data for the same date exists, update it
          const existingUrlData = existingUserData.urlData.find(
            (urlData: any) => urlData.urlLink === urlLink
          );

          if (existingUrlData) {
            // Website already exists, so just push new timestamp and time_spent
            if (!existingUrlData.timestamps.includes(localeTimeString)) {
              existingUrlData.timestamps.push(localeTimeString);
              existingUrlData.timespent.push(parsedTimeSpent);
            }
          } else {
            // Website doesn't exist yet, so add a new entry with static tags
            existingUserData.urlData.push({
              urlLink: urlLink,
              timestamps: [localeTimeString],
              tags: staticTags,
              timespent: [parsedTimeSpent],
            });
          }
        } else {
          // Add a new entry for the currentDate with an empty timespent array and static tags
          (user as any).userData.push({
            dataDate: currentDate,
            urlData: [
              {
                urlLink: urlLink,
                timestamps: [localeTimeString],
                tags: staticTags,
                timespent: [parsedTimeSpent],
              },
            ],
          });
        }
      }

      await user.save();

      res.status(200).json(user);
    } catch (error) {
      console.error('Error adding user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/user-data/:publicAddress
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

      // Optionally, you can clear the userData for the user
      user.userData = [];

      await user.save();

      res.status(200).json({ message: 'User data deleted successfully' });
    } catch (error) {
      console.error('Error deleting user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/user-data/:publicAddress
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

      res.status(200).json(user.userData);
    } catch (error) {
      console.error('Error retrieving user data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// // GET /api/user-data/top-sites/:publicAddress
// router.get(
//   '/api/user-data/top-sites/:publicAddress',
//   async (req: Request, res: Response) => {
//     const { publicAddress } = req.params;

//     try {
//       // Calculate the date one month ago from the current date
//       const oneMonthAgo = new Date();
//       oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//       const user = await DFrameUser.findOne({ publicAddress });

//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       // Filter userData for the past one month
//       const pastOneMonthUserData = (user as any).userData.filter(
//         (data: any) => {
//           const dataDate = new Date(data.dataDate);
//           return dataDate >= oneMonthAgo;
//         }
//       );

//       // Create a map to store website visit counts
//       const websiteVisitCounts = new Map();

//       // Iterate through the pastOneMonthUserData to count website visits
//       pastOneMonthUserData.forEach((data: any) => {
//         if (data.urlData) {
//           data.urlData.forEach((urlData: any) => {
//             const urlLink = urlData.urlLink.trim();

//             if (!websiteVisitCounts.has(urlLink)) {
//               websiteVisitCounts.set(urlLink, 0);
//             }

//             // Count visits based on the length of the timestamps array
//             const visits = urlData.timestamps.length;
//             websiteVisitCounts.set(
//               urlLink,
//               websiteVisitCounts.get(urlLink) + visits
//             );
//           });
//         }
//       });

//       // Convert the map to an array of objects
//       const topVisitedWebsites = Array.from(
//         websiteVisitCounts,
//         ([website, visits]) => ({ website, visits })
//       );

//       // Sort the websites based on visit counts in descending order
//       topVisitedWebsites.sort((a, b) => b.visits - a.visits);

//       res.status(200).json(topVisitedWebsites);
//     } catch (error) {
//       console.error('Error retrieving top visited websites:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }
// );
// GET /api/user-data/top-sites/:publicAddress
router.get(
  '/api/user-data/top-sites/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;

    try {
      // Calculate the date one month ago from the current date
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Filter userData for the past one month
      const pastOneMonthUserData = (user as any).userData.filter(
        (data: any) => {
          const dataDate = new Date(data.dataDate);
          return dataDate >= oneMonthAgo;
        }
      );

      // Create a map to store website visit counts
      const websiteVisitCounts = new Map();

      // Iterate through the pastOneMonthUserData to count website visits
      pastOneMonthUserData.forEach((data: any) => {
        if (data.urlData) {
          data.urlData.forEach((urlData: any) => {
            const urlLink = urlData.urlLink.trim();

            if (!websiteVisitCounts.has(urlLink)) {
              websiteVisitCounts.set(urlLink, 0);
            }

            // Count visits based on the length of the timestamps array
            const visits = urlData.timestamps.length;
            websiteVisitCounts.set(
              urlLink,
              websiteVisitCounts.get(urlLink) + visits
            );
          });
        }
      });

      // Convert the map to an array of objects with "name" and "visits"
      const topVisitedWebsites = Array.from(
        websiteVisitCounts,
        ([website, visits]) => ({ name: website, visits })
      );

      // Sort the websites based on visit counts in descending order
      topVisitedWebsites.sort((a, b) => b.visits - a.visits);
      // Slice the array to return only the top 5 visited websites
      const top5VisitedWebsites = topVisitedWebsites.slice(0, 5);
      res.status(200).json(top5VisitedWebsites);
    } catch (error) {
      console.error('Error retrieving top visited websites:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/user-data/top-times/:publicAddress
router.get(
  '/api/user-data/top-times/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;

    try {
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create a map to store the sum of timespent for each website
      const websiteTimespentSum = new Map();

      // Iterate through the user's data to calculate timespent sum
      (user as any).userData.forEach((data: any) => {
        if (data.urlData) {
          data.urlData.forEach((urlData: any) => {
            const urlLink = urlData.urlLink.trim();
            const timespentSum = urlData.timespent.reduce(
              (total: number, time: number) => total + time,
              0
            );

            if (!websiteTimespentSum.has(urlLink)) {
              websiteTimespentSum.set(urlLink, 0);
            }

            websiteTimespentSum.set(
              urlLink,
              websiteTimespentSum.get(urlLink) + timespentSum
            );
          });
        }
      });

      // Convert the map to an array of objects with "name" and "time"
      const topTimespentWebsites = Array.from(
        websiteTimespentSum,
        ([website, timespentSum]) => ({ name: website, time: timespentSum })
      );

      // Sort the websites based on timespent sum in descending order
      topTimespentWebsites.sort((a, b) => b.time - a.time);

      // Slice the array to return only the top 5 websites
      const top5TimespentWebsites = topTimespentWebsites.slice(0, 5);

      res.status(200).json(top5TimespentWebsites);
    } catch (error) {
      console.error('Error retrieving top timespent websites:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /api/user-data/tags/:publicAddress
router.get(
  '/api/user-data/tags/:publicAddress',
  async (req: Request, res: Response) => {
    const { publicAddress } = req.params;
    const { tags } = req.body;

    try {
      const user = await DFrameUser.findOne({ publicAddress });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create an array to store matching websites
      const matchingWebsites: any[] = [];

      // Iterate through the user's data to find websites with matching tags
      (user as any).userData.forEach((data: any) => {
        if (data.urlData) {
          data.urlData.forEach((urlData: any) => {
            const urlLink = urlData.urlLink.trim();
            const urlTags = urlData.tags;

            // Check if any of the tags match the provided tags
            if (tags.some((tag: any) => urlTags.includes(tag))) {
              matchingWebsites.push({ urlLink, tags: urlTags });
            }
          });
        }
      });

      res.status(200).json(matchingWebsites);
    } catch (error) {
      console.error('Error retrieving matching websites by tags:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// // Define the route to get the latest unseen ad by public address.
// router.get('/api/user/get-latest-ad/:publicAddress', async (req, res) => {
//   const publicAddress = req.params.publicAddress;

//   try {
//     // Find the user document based on the public address.
//     const user = await DFrameUser.findOne({ publicAddress });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Search for the latest unseen ad.
//     let latestUnseenAd = null;
//     for (const userAd of user.userAds as any) {
//       for (const ad of userAd.ads) {
//         if (
//           ad.status === 'unseen' &&
//           (!latestUnseenAd || userAd.date > latestUnseenAd.date)
//         ) {
//           latestUnseenAd = ad;
//         }
//       }
//     }

//     if (!latestUnseenAd || !latestUnseenAd.adsId) {
//       return res.json({ latestAdId: null });
//     }

//     res.json({ latestAdId: latestUnseenAd.adsId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// Define the route to get the latest unseen ad by public address.
router.get('/api/user/get-latest-ad/:publicAddress', async (req, res) => {
  const publicAddress = req.params.publicAddress;

  try {
    // Find the user document based on the public address.
    const user = await DFrameUser.findOne({ publicAddress });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Search for the latest unseen ad for the current day.
    let latestUnseenAd = null;
    for (const userAd of user.userAds as any) {
      const ads = userAd.ads;
      const latestAdForDay = ads[ads.length - 1]; // Get the last ad for the day.
      if (latestAdForDay && latestAdForDay.status === 'unseen') {
        latestUnseenAd = latestAdForDay;
      }
    }

    if (!latestUnseenAd || !latestUnseenAd.adsId) {
      return res.json({ latestAdId: null });
    }

    res.json({ latestAdId: latestUnseenAd.adsId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Define the route to get the latest unseen ad by public address.
// router.get('/api/user/get-latest-ad/:publicAddress', async (req, res) => {
//   const publicAddress = req.params.publicAddress;

//   try {
//     // Find the user document based on the public address.
//     const user = await DFrameUser.findOne({ publicAddress });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Flatten the userAds array and filter for unseen ads.
//     const unseenAds = (user.userAds as any)
//       .flatMap((userAd: any) => userAd.ads)
//       .filter((ad: any) => ad.status === 'unseen');

//     if (unseenAds.length === 0) {
//       return res.json({ latestAdId: null });
//     }

//     // Sort the unseen ads by date to find the latest one.
//     unseenAds.sort((a: any, b: any) => b.date.localeCompare(a.date));

//     res.json({ latestAdId: unseenAds[0].adsId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.post('/api/update-ad-status/:publicAddress/:adId', async (req, res) => {
  const publicAddress = req.params.publicAddress;
  const adId = req.params.adId;

  try {
    // Find the user document based on the public address.
    const user = await DFrameUser.findOne({ publicAddress });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the specific ad and update its status to 'seen'.
    let adFound = false;
    for (const userAd of user.userAds as any) {
      for (const ad of userAd.ads) {
        if (ad.adsId === adId && ad.status === 'unseen') {
          ad.status = 'seen';
          adFound = true;
          break;
        }
      }
      if (adFound) {
        break;
      }
    }

    if (!adFound) {
      return res
        .status(404)
        .json({ message: 'Ad not found or already marked as seen' });
    }

    // Save the updated user document.
    await user.save();

    res.json({ message: 'Ad status updated to "seen"' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export { router as UserRouter };
