/** @format */

import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';

import { errorHandler, NotFoundError, currentUser, logRequest } from './common';
import { authRouter } from './src/api/user';
import { adminRouter } from './src/api/admin';
import { userRouter } from './src/api/user';
import { LearnMoreRouter } from './src/api/user/learnmore.route';
import { HelpRouter } from './src/api/user/help.route';
import { FaqRouter } from './src/api/user/faq.route';
const cors = require('cors');
const app = express();
const corsOptions = {
  origin: 'https://d-frame-user-dashboard.vercel.app',
  allowedHeaders: ['Content-Type'], // Add 'Content-Type' to the list of allowed headers
};

app.use(cors(corsOptions));
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
app.use(userRouter);
app.use(LearnMoreRouter);
app.use(HelpRouter);
app.use(FaqRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
