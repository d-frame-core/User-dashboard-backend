const mongoose = require('mongoose');

const HelpSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const Help = mongoose.model('Help', HelpSchema);

module.exports = Help;
