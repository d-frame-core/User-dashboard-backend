const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: String,
  profileImage: {
    data: Buffer,
    contentType: {
      type: String,
      enum: ['image/jpeg', 'image/png'],
      required: true
    }
  }
});

module.exports = mongoose.model('Profile', profileSchema);

