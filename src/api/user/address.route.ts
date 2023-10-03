/** @format */
/** @format */

import path from 'path';
import express, { Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import { AddressProof } from '../../models/address.model';

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
  '/api/address-proof/:publicAddress',
  upload.array('images', 2),
  async (req, res) => {
    {
      if (req.files && (req.files as any).length > 0) {
        const images = (req.files as any).map((file: any) => {
          return {
            data: file.buffer,
            contentType: file.mimetype,
          };
        });

        const publicAddress = req.params.publicAddress;

        // Create a new Profile document with the images and publicAddress
        const address = new AddressProof({
          images: images, // Assuming "images" is the field in your model to store multiple images
          publicAddress: publicAddress,
        });

        address.save((err: any, result: any) => {
          if (err) {
            console.error(err);
            return res.status(400).json({ error: err });
          }

          // Generate URLs for the uploaded images
          const imageUrls = images.map((image: any, index: any) => {
            const extension = path.extname(
              (req.files as any)[index].originalname
            );
            const imageName = `${publicAddress}-${index}${extension}`;
            const imageUrl = `${req.protocol}://${req.get(
              'host'
            )}/uploads/address/${imageName}`;

            // Rename the uploaded file with the new filename
            const newImagePath = path.join(
              __dirname,
              '..',
              '..',
              '..',
              'uploads',
              'address',
              imageName
            );
            fs.renameSync((req.files as any)[index].path, newImagePath);

            return imageUrl;
          });

          console.log('Images uploaded successfully. URLs:', imageUrls);
          res.status(200).json({
            message: 'Images uploaded successfully',
            data: imageUrls,
          });
        });
      } else {
        console.log('No files were uploaded.');
        return res.status(400).json({ error: 'No file uploaded' });
      }
    }
  }
);

export { router as AddressRouter };
