const mongoose = require('mongoose');
const { app } = require('./app');
require('dotenv').config()

const start = async () => {
	try {
		
		await mongoose.connect(process.env.CONNECTIONSTRING);
		// await mongoose.connect("mongodb://localhost:27017/dframedb",{
		// 	useNewUrlParser:true, useUnifiedTopology:true
		// });
		console.log("Db Connected");
	} catch (err) {
		console.error(err);
	}
	app.listen(3000, () => {
        console.log("App Started");
	});
};

start();
