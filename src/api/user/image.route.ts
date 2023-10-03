/** @format */

import path from 'path';
import express, { Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import { Profile } from '../../models/image.model';

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

router.post(
  '/api/profile-image/:publicAddress',
  upload.single('image'),
  async (req, res) => {
    {
      if (req.file) {
        const profile = new Profile({
          profileImage: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          },
          publicAddress: req.params.publicAddress,
        });
        profile.save((err, result) => {
          if (err) {
            console.log(err);
            return res.status(400).json({ error: err });
          }

          // Generate URL for the uploaded image

          if (!req.file) {
            res.status(400).send('No File attached');
          } else {
            const publicAddress = req.params.publicAddress;
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
            fs.renameSync(req.file.path, newImagePath);

            console.log('Image uploaded successfully. URL:', imageUrl);
            res.status(200).json({
              message: 'Profile picture uploaded successfully',
              data: { imageUrl },
            });
          }
        });
      } else {
        return res.status(400).json({ error: 'No file uploaded' });
      }
    }
  }
);

router.get('/api/profile-image/:publicAddress', async (req, res) => {
  const publicAddress = req.params.publicAddress;
  Profile.findOne({ publicAddress }, (err: any, profile: any) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
    if (!profile) {
      return res.status(404).json({ error: 'Profile picture not found' });
    }

    const extension = profile.profileImage.contentType.replace('image/', '');
    const imagePath = path.join(
      __dirname,
      '../',
      '../',
      '../',
      '/uploads',
      '/profile',
      `${publicAddress}.${extension}`
    );

    fs.readFile(imagePath, (err, data) => {
      console.log(err);
      if (err) {
        return res.status(400).json({ error: err });
      }

      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(data);
    });
  });
});

router.patch(
  '/api/profile-image/:publicAddress',
  upload.single('image'),
  async (req, res) => {
    if (req.file) {
      const { publicAddress } = req.params;

      // Find the existing profile by publicAddress
      Profile.findOne({ publicAddress }, async (err: any, profile: any) => {
        if (err) {
          return res.status(400).json({ error: err });
        }
        if (!profile) {
          return res.status(404).json({ error: 'Profile picture not found' });
        }

        // Delete the previous image if it exists
        const previousImageFileName = `${publicAddress}.${profile.profileImage.contentType.replace(
          'image/',
          ''
        )}`;
        const previousImagePath = path.join(
          __dirname,
          '..',
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
          profile.profileImage.data = req.file?.buffer;
          profile.profileImage.contentType = req.file?.mimetype;

          profile.save((err: any, result: any) => {
            if (err) {
              return res.status(400).json({ error: err });
            }

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
            fs.renameSync((req.file as any).path, newImagePath);

            console.log('Image uploaded successfully. URL:', imageUrl);
            res.status(200).json({
              message: 'Profile picture updated successfully',
              data: { imageUrl },
            });
          });
        });
      });
    } else {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  }
);

export { router as ProfileImageRouter };
