const jwt = require("jsonwebtoken");
const Token = require('../models/TokenModel');
require('dotenv').config()

// Generate JWT token
exports.generateToken = function(user) {
  const jwt = require("jsonwebtoken");
  require('dotenv').config();

  const payload = {
    userId: user.id,
    walletAddress: user.walletAddress
  };

  const options = {
    expiresIn: "30d"
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, options);

  // Save the token to the database
  const newToken = new Token({
    userId: user.id,
    email: user.email,
    token,
    expiresAt: new Date(Date.now()+(30*24*60*60 )*1000)
  });

  newToken.save((error) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Token saved successfully.");
    }
  });
 // console.log(newToken);

  return token;
};
// Refresh JWT token
exports.refreshToken = async function(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = exports.generateToken({
      id: decoded.userId,
      email: decoded.email
    });

    return newToken;
  } catch (err) {
    return null;
  }
};

// Verify JWT token
exports.verifyToken = function(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};
