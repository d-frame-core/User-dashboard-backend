const express = require('express');
const router = express.Router();
const controller = require('../controllers/Kyc1Controller');
const Blacklist = require('../models/BlacklistModel');



// function verifyToken(req, res, next) {
//     // Get JWT token from Authorization header
//     const bearerHeader = req.headers['authorization'];
//     if(typeof bearerHeader !== 'undefined'){
//         const bearer = bearerHeader.split(" ");
//         const token = bearer[1];
//         req.token = token;
//         next();
        
//     }else{
//       res.send({
//         result:'Token is not Valid'
//       })
//     }
    
//   }

function verifyToken(req, res, next) {
  // Get JWT token from Authorization header
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    req.token = token;

    // Check if token is blacklisted
    Blacklist.findOne({ token }, (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Internal server error' });
      } else if (result) {
        res.status(401).json({ message: 'Token is blacklisted' });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'Token is not valid' });
  }
}



router.post("/step1/:id",verifyToken, controller.postKyc1);
// router.put("/step1/:id",verifyToken, controller.updateUser);
router.post("/step2/:id",verifyToken, controller.postKyc2);
router.get("/:id", controller.getKyc1);


module.exports = router;