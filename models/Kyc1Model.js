const mongoose = require('mongoose');

const kyc1Schema = mongoose.Schema({
  kyc1Id:  Number,
  firstName:   String,
  lastName:   String, 
  userName:   String,
  email:  String, 
  phoneNumber:  Number, 
  
});

const kyc2Schema = mongoose.Schema({
  kyc2Id: Number,
  gender: String,
  country: String,
  dob: Date,
  annualIncome : String,
  permanentAddress : String,
})

module.exports = mongoose.model("Kyc1", kyc1Schema);
module.exports = mongoose.model("Kyc2", kyc2Schema);