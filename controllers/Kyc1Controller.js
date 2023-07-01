const mongoose = require("mongoose");
const Kyc1 = require("../models/Kyc1Model");
const Kyc2 = require("../models/Kyc1Model");
const User = require("../models/UsersModel")
const jwt = require('jsonwebtoken');

const getKyc1 = async (req, res) => {
  try {
    const foundKyc1 = await Kyc1.findOne({ _id: req.params.id });
    if (foundKyc1) {
      res.status(200).json(foundKyc1);
    } else {
      res.status(200).json("No User Found");
    }
  } catch (err) {
    res.status(500).json({ message: "Error Occured" });
  }
};


// const postKyc1 = async (req, res) => {

 
//   const { firstName, lastName, userName, email, phoneNumber, kyc1Id } = req.body;

//   try {
//     const updatedUser = await User.findOneAndUpdate(
//       { _id: req.params.id },
//       { 
//         $set: {
//           "kyc1.firstName": firstName,
//           "kyc1.lastName": lastName,
//           "kyc1.userName": userName,
//           "kyc1.email": email,
//           "kyc1.phoneNumber": phoneNumber,
//           "kyc1.kyc1Id": kyc1Id
//         }
//       },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ message: 'KYC1 details saved successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };








const postKyc1 = async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      res.send({ result: "Invalid Token! Access Denied" });
    } else {
      const { firstName, lastName, userName, email, phoneNumber } = req.body;

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.params.id },
          { 
            $set: {
              "kyc1.firstName": firstName,
              "kyc1.lastName": lastName,
              "kyc1.userName": userName,
              "kyc1.email": email,
              "kyc1.phoneNumber": phoneNumber,
              
            }
          },
          { new: true }
        );
    
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        res.json({ message: 'KYC1 details saved successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });

  console.log(req.body);
};



const postKyc2 = async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      res.send({ result: "Invalid Token! Access Denied" });
    } else {
      const { gender, country, dob, annualIncome, permanentAddress } = req.body;

      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.params.id },
          { 
            $set: {
              "kyc2.gender": gender,
              "kyc2.country": country,
              "kyc2.dob": dob,
              "kyc2.annualIncome": annualIncome,
              "kyc2.permanentAddress": permanentAddress,
              
            }
          },
          { new: true }
        );
    
        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        res.json({ message: 'KYC2 details saved successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });

  console.log(req.body);
};


module.exports = {
 postKyc1,
 getKyc1,
 postKyc2,
 
};


