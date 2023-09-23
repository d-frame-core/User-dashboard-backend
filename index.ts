/** @format */

import mongoose from 'mongoose';
import { app } from './app';
import config from './src/config';
import { Logger } from './common';
import dotenv from 'dotenv';

const envFound = dotenv.config();
const start = async () => {
  try {
    await mongoose
      .connect(`${process.env.MONGOSTRING}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true,
      })
      .then(() => {
        console.log('Connected to database');
      });
    Logger.info('=========================================');
    Logger.info('[INFO]:  ✌️ DB loaded and connected! ✌️');
    Logger.info('=========================================');
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    Logger.info('=========================================');
    Logger.info('[INFO]:   ✌️ App Started ✌️');
    Logger.info('=========================================');
  });
};

start();
