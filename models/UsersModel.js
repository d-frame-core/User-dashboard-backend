const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userId:  String,
  walletAddress:  String, 
  reffererCount: Number,
  ipAddress: String,

  kyc1:{
    
    firstName:   String,
    lastName:   String, 
    userName:   String,
    email:  String, 
    phoneNumber:  Number,
  },

  kyc2:{
    
    gender: String,
    country: String,
    dob: Date,
    annualIncome : String,
    permanentAddress : String,
  }
  
});

module.exports = mongoose.model("User", userSchema);
