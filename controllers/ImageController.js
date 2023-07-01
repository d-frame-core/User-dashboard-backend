const Profile = require("../models/ImageModel");
const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');
// Upload a profile picture and save it to the database


exports.uploadProfilePicture = (req, res) => {
  if (req.file) {
    const profile = new Profile({
      name:req.body.name,
      profileImage: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    profile.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      }

      // Generate URL for the uploaded image
      const extension = path.extname(req.file.originalname);
      const imageName = `${result._id}${extension}`;
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageName}`;

      // Rename the uploaded file with _id
      const newImagePath = path.join(__dirname, '..', 'uploads', imageName);
      fs.renameSync(req.file.path, newImagePath);

      console.log("Image uploaded successfully. URL:", imageUrl);
      res.status(200).json({
        message: "Profile picture uploaded successfully",
        data:  { imageUrl },
      });
    });
  } else {
    return res.status(400).json({ error: "No file uploaded" });
  }
};




exports.getAllProfilePictures = (req, res) => {
  Profile.find({}, (err, profiles) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ data: profiles });
  });
};
// Get a single profile picture from the database by _id
exports.getProfilePictureById = (req, res) => {
  Profile.findById(req.params.id, (err, profile) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (!profile) {
      return res.status(404).json({ error: "Profile picture not found" });
    }

    const imagePath = path.join(__dirname, '../uploads', `${profile._id}-${profile.profileImage}`);

    fs.readFile(imagePath, (err, data) => {
      if (err) {
        return res.status(400).json({ error: err });
      }

      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(data);
    });
  });
};


// Delete a profile picture from the database
exports.deleteProfilePicture = (req, res) => {
  Profile.findByIdAndDelete(req.params.id, (err, result) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (!result) {
      return res.status(404).json({ error: "Profile picture not found" });
    }
    res.status(200).json({ message: "Profile picture deleted successfully" });
  });
};

// Update a profile picture in the database
exports.updateProfilePicture = (req, res) => {
  if (req.file) {
    Profile.findById(req.params.id, (err, profile) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      if (!profile) {
        return res.status(404).json({ error: "Profile picture not found" });
      }
      // profile.name = req.body.name;
      profile.profileImage.data = req.file.buffer;
      profile.profileImage.contentType = req.file.mimetype;
      profile.save((err, result) => {
        if (err) {
          return res.status(400).json({ error: err });
        }
        res
          .status(200)
          .json({
            message: "Profile picture updated successfully",
            data: result,
          });
      });
    });
  } else {
    return res.status(400).json({ error: "No file uploaded" });
  }
};


// const Profile = require('../models/ImageModel');

// // Upload a profile picture and save it to the database
// exports.uploadProfilePicture = (req, res) => {
//   if (req.file) {
//     const profile = new Profile({
//       name: req.body.name,
//       profileImage: {
//         data: req.file.buffer,
//         contentType: req.file.mimetype
//       }
//     });
//     profile.save((err, result) => {
//       if (err) {
//         return res.status(400).json({ error: err });
//       }
//       res.status(200).json({ message: 'Profile picture uploaded successfully', data: result });
//     });
//   } else {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }
// };

// /*const Profile = require('../models/ImageModel');

// // Upload a profile picture and save it to the database
// exports.uploadProfilePicture = (req, res) => {
//   const profile = new Profile({
//     //name: req.body.name,
    
//     profileImage: {
//       data: req.file.buffer,
//       contentType: req.file.mimetype
//     }
//   });
//   profile.save((err, result) => {
//     if (err) {
//       return res.status(400).json({ error: err });
//     }
//     res.status(200).json({ message: 'Profile picture uploaded successfully', data: result });
//   });
// };*/
