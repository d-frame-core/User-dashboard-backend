import mongoose from 'mongoose';
import {app} from './app';
import config from './src/config';
import {Logger} from './common';

const start = async () => {
	try {
		await mongoose.connect(config.databaseURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: true,
		});
		Logger.info('=========================================');
		Logger.info('[INFO]:  ✌️ DB loaded and connected! ✌️');
		Logger.info('=========================================');
	} catch (err) {
		console.error(err);
	}
	app.listen(config.port, () => {
		Logger.info('=========================================');
		Logger.info('[INFO]:   ✌️ App Started ✌️');
		Logger.info('=========================================');
	});
};

start();
