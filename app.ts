/** @format */

import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';

import { errorHandler, NotFoundError, currentUser, logRequest } from './common';
import { authRouter } from './src/api/user';
import { adminRouter } from './src/api/admin';
import { LearnMoreRouter } from './src/api/user/learnmore.route';
import { HelpRouter } from './src/api/user/help.route';
import { FaqRouter } from './src/api/user/faq.route';
import { UserRouter } from './src/api/user/user.route';
import { KYC1Router } from './src/api/user/kyc1.route';
import { KYC2Router } from './src/api/user/kyc2.route';
import { KYC3Router } from './src/api/user/kyc3.route';
import { UserDataRouter } from './src/api/user/user.data.route';
import { AddressRouter } from './src/api/user/address.route';
import { ProfileImageRouter } from './src/api/user/image.route';
import { SurveyRouter } from './src/api/user/survey.route';
const cors = require('cors');
const app = express();
const corsOptions = {
  origin: 'https://d-frame-user-dashboard.vercel.app',
  allowedHeaders: ['Content-Type'], // Add 'Content-Type' to the list of allowed headers
};

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('trust proxy', true);
app.use(
  helmet({
    frameguard: {
      action: 'deny',
    },
    hidePoweredBy: true,
    xssFilter: true,
    noSniff: true,
    ieNoOpen: true,
    hsts: {
      maxAge: 7776000,
      force: true,
    },
  })
);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});
app.use('/healthcheck', (req, res) => {
  res.status(200).json();
});
app.use(logRequest);
app.use(currentUser);
app.use(authRouter);
app.use(adminRouter);
app.use(UserRouter);
app.use(LearnMoreRouter);
app.use(HelpRouter);
app.use(FaqRouter);
app.use(SurveyRouter);
// app.use(KYC1Router);
// app.use(KYC2Router);
// app.use(KYC3Router);
// app.use(UserDataRouter);
// app.use(AddressRouter);
// app.use(ProfileImageRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
