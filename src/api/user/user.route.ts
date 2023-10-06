/** @format */

import express, { Request, Response } from 'express';
import { DFrameUser } from '../../models/user.model'; // Replace with the correct import path for your model

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
      user.kyc1.status = true;
      user.kyc1.verified = false;

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
        permanentAddress,
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
      user.kyc2.details.permanentAddress = permanentAddress;

      // Update KYC2 status to true
      user.kyc2.status = true;
      user.kyc2.verified = false;

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
            verified: false,
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

export { router as UserRouter };
