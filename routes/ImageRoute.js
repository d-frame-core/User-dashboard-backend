
const express = require('express');
const multer = require('multer');
const router = express.Router();
const profileController = require('../controllers/ImageController');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = function (req, file, cb) {
  // Accept only image files
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter,limits:{fieldSize: 25 * 1024 * 1024} });

router.post('/uploadProfilePicture', upload.single('image'),  profileController.uploadProfilePicture);

// Route to get a profile picture by its ID
router.get("/:id", profileController.getProfilePictureById);
//get all image
router.get("/profile/pictures", profileController.getAllProfilePictures);
// Route to update a profile picture by its ID
router.put( "/:id",upload.single("image"), profileController.updateProfilePicture);

// Route to delete a profile picture by its ID
router.delete("/:id", profileController.deleteProfilePicture);



module.exports = router;

// const express = require('express');
// const multer = require('multer');
// const router = express.Router();
// const profileController = require('../controllers/ImageController');


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });

// const fileFilter = function (req, file, cb) {
//   // Accept only image files
//   if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//     return cb(new Error('Only image files are allowed!'), false);
//   }
//   cb(null, true);
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter,limits:{fieldSize: 25 * 1024 * 1024} });

// router.post('/uploadProfilePicture', upload.single('ProfileImage'),  profileController.uploadProfilePicture);

// module.exports = router;
// /*const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const profileController = require('../controllers/ImageController');

// // Multer memory storage for storing image in memory as buffer
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Upload a profile picture and save it to the database
// router.post('/uploadProfilePicture', upload.single('image'), profileController.uploadProfilePicture);

// module.exports = router;*/
