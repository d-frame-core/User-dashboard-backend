import express, {Request, Response} from 'express';
import { User } from '../../models/user.model';
import { User_data } from '../../models/user-data.model';

const { Kafka } = require('kafkajs')

const router = express.Router();
import {Magic, SDKError} from '@magic-sdk/admin';


const kafka = new Kafka({
	clientId: 'my-app',
	brokers: [process.env.KAFKA_HOST],
  })

router.get('/api/user/update-email', async (req: Request, res: Response) => {
    let email = req.query.email
    const magic = new Magic(process.env.MAGIC_SECRET_KEY);
	if (req.headers && req.headers.authorization) {
		const DIDToken = req.headers.authorization.substring(7);
		try {
			const metadata = await magic.users.getMetadataByToken(DIDToken);
			console.log(metadata);
			let user = await User.updateOne({publicKey: String(metadata.publicAddress)}, {email: String(email)})
            res.send(user)
		} catch (err) {
			if (err instanceof SDKError) {
				console.log(err);
			}
		}
	} else {
        res.status(404).send("User not found")
    }
});

router.post('/api/user/profileData', async (req: Request, res: Response) => {
	const magic = new Magic(process.env.MAGIC_SECRET_KEY);
	let data = req.body;
	console.log(req.body)
	if (req.headers && req.headers.authorization) {
		const DIDToken = req.headers.authorization.substring(7);
		try {
			const metadata = await magic.users.getMetadataByToken(DIDToken);
			console.log(metadata);
			let dataCheck = await User_data.findOne({publicKey: String(metadata.publicAddress)});
			if (!dataCheck) {
			    let mongoData = await User_data.create(data) 
			    console.log(mongoData)
			    res.send({data: mongoData})
			} else {
				let profileData = await User_data.findOneAndUpdate({publicKey: String(metadata.publicAddress)}, data, ); 
                res.send({data: profileData})
			}
		} catch (err) {
			if (err instanceof SDKError) {
				console.log(err);
			}
		}
	} else {
        res.status(404).send("User not found")
    }
})

router.post('/api/user/updateProfileData/:publicAddress', async (req: Request, res: Response) => {
	const magic = new Magic(process.env.MAGIC_SECRET_KEY);
	let datas = req.body;
	console.log(req.body);
	// if (req.headers && req.headers.authorization) {
	// 	const DIDToken = req.headers.authorization.substring(7);
		try {
			// const metadata = await magic.users.getMetadataByToken(DIDToken);
			// console.log(metadata);
			let dataCheck = await User.findOne({publicAddress: String(datas.publicAddress)});
			console.log("dataCheck", dataCheck);
			if (dataCheck == null || undefined) {
				console.log("data reached");
			    let mongoData = await User.create(datas) 
			    console.log("mongoData", mongoData);
			    res.send({data: mongoData})
			} else {
				let profileData = await User.findOneAndUpdate({publicAddress: String(datas.publicAddress)}, datas, { useFindAndModify: false } ); 
                res.send({data: profileData})
			}
		} catch (err) {
			if (err instanceof SDKError) {
				console.log(err);
			}
		}
	// } else {
    //     res.status(404).send("User not found")
    // }
})

router.get('/api/user/updateProfileData/:publicAddress', async (req: Request, res: Response) => {
	const magic = new Magic(process.env.MAGIC_SECRET_KEY);
    const userPublicAddress = req.params.publicAddress;
	console.log(userPublicAddress);
	try {
	    let dataCheck = await User.findOne({publicAddress: String(userPublicAddress)});
			if (dataCheck) {
				console.log(dataCheck);
		        res.send(dataCheck);
			} else {
				console.log("Please Update your details");
			}
		} catch (err) {
					if (err instanceof SDKError) {
						console.log(err);
					}
				}


	// console.log(req.body)
	// // if (req.headers && req.headers.authorization) {
	// // 	const DIDToken = req.headers.authorization.substring(7);
	// 	try {
	// 		// const metadata = await magic.users.getMetadataByToken(DIDToken);
	// 		// console.log(metadata);
	// 		let dataCheck = await User_data.findOne({publicAddress: String(datas.publicAddress)});
	// 		if (!dataCheck) {
	// 		    let mongoData = await User_data.create(datas) 
	// 		    console.log(mongoData)
	// 		    res.send({data: mongoData})
	// 		} else {
	// 			let profileData = await User_data.findOneAndUpdate({publicAddress: String(datas.publicAddress)}, datas, { useFindAndModify: false } ); 
    //             res.send({data: profileData})
	// 		}
	// 	} catch (err) {
	// 		if (err instanceof SDKError) {
	// 			console.log(err);
	// 		}
	// 	}
	// } else {
    //     res.status(404).send("User not found")
    // }
});

router.post('/api/user/dataPostAPI', async (req: Request, res: Response) => {
    let data = req.body;
	console.log(req.body)
	const producer = kafka.producer()
	console.log(producer)
    await producer.connect()

    await producer.send({
       topic: 'test',
       messages: [data],	
    })
//	let mongoData = await User_data.create(data) 
//	console.log(mongoData)
//    res.send({data: mongoData})
})

export{router as userRouter}