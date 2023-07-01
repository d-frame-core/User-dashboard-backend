const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  walletAddress: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;