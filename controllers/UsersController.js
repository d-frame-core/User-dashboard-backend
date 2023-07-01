import { createConnection } from "mysql2";
import { randomBytes } from "crypto";
const mongoose = require("mongoose");
const User = require("../models/UsersModel");
const Blacklist = require('../models/BlacklistModel');
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');
require('dotenv').config()



const signupUser = async (req, res) => {

  //For Fetching IPaddress
  const url = "https://api.ipify.org/?format=json"

//Making Connection with Aurora DB(Public) on AWS using mySQL2 library
  const connection = createConnection({
    host: "<Cluster EndPoint>",
    user: "Cluster Username",
    password: "<Cluster Password>",
    port: 3306, //<Port of cluster(3306)>
    database: "<Database name given while creating DB on AWS>",
  });

  //Public Address
  const walletAddress = req.body.walletAddress;

  //ReffereCode if any
  const id=req.body.reffererId;
  try {
    const user = await User.findOne({ walletAddress });

    if (user) {
      // check if the token is blacklisted
      const blacklistedToken = await Blacklist.findOne({ token: req.body.token });
      if (blacklistedToken) {
        res.status(401).json({ message: 'Token is blacklisted' });
        return;
      }

      const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'User Exist! jwt session started', user, token });
    } else {

      //Refferal System Backend////////////////////////////////////
      var ip
      await axios.get(url)
      .then((response) =>{
        ip=response.data["ip"]
      })
      if(mongoose.Types.ObjectId.isValid(id)){
        const user = await User.findOne({ _id: id });
        if(user===null){
        console.log("Not a valid refferer id")
      }
      else{
        if(user.ipAddress!==ip){
          await schemaModel.updateOne({ _id: id }, { $inc: { reffererCount: 1 } });
        }else{
          console.log("You already taken rewards")
        }
      }
    }
    else{
      console.log("Not a valid refferer id")
    }
    //Refferal System Backend////////////////////////////////////

      const newUser = new User({
        userId: req.body.userId,
        walletAddress: req.body.walletAddress,
        token: req.body.token,
        reffererCount:0,
        ipAddress:ip
      });
      const savedUser = await newUser.save();
      if (savedUser) {
        const token = jwt.sign({ userId: savedUser.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'User created, token created', savedUser, token });
      } else {
        res.status(201).json({ message: 'No address found please Signup', walletAddress });
      }

      //////////////////////////////////////////////////////
      //First create table in the Aurora database with Primary Key(publicAddress), initVector and securityKey Cloumn using createTableAWSAuroraDB.js
      const initVector = randomBytes(32).toString('base64');
			const securityKey = randomBytes(32).toString('base64');

      connection.connect(function (err) {
        if (err) throw err;
        console.log("Connected to AWS Aurora DB");
        connection.query(
          `INSERT INTO <Table Name> (publicAddress, initVector, securityKey) VALUES ('${walletAddress}', '${initVector}' , '${securityKey}')`,
          function (err, result, fields) {
            if (err) res.send(err);
            if (result)
              res.send({
                publicAddress: walletAddress,
                initVector: initVector,
                securityKey: securityKey,
              });
            if (fields) console.log(fields);
          }
        );
        connection.end();
      });
      //////////////////////////////////////////////////////


    }
  } catch (err) {
    res.status(500).json({ message: 'Error Occured' });
  }
};
const logoutUser = async(req, res)=> {
  // get the JWT token from the request header
  const token = req.headers.authorization.split(' ')[1];
  
  // add the token to a blacklist
  const blacklistedToken = new Blacklist({ token });
  await blacklistedToken.save();
  
  // send a response to the client
  res.json({ message: 'Logout successful' });
};

module.exports = {
  
  signupUser,
  logoutUser
};


