const mongoose = require('mongoose');

const LearnMoreSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const LearnMore = mongoose.model('LearnMore', LearnMoreSchema);

module.exports = LearnMore;
