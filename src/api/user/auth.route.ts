import express, {Request, Response} from 'express';
import {Magic, SDKError} from '@magic-sdk/admin';

import {User} from '../../models/user.model';

const router = express.Router();

const magic = new Magic(process.env.MAGIC_SECRET_KEY);

router.get('/api/login', async (req: Request, res: Response) => {
	/*
		  Assumes DIDToken was passed in the Authorization header
		  in the standard `Bearer {token}` format.
		 */
	const magic = new Magic(process.env.MAGIC_SECRET_KEY);
	if (req.headers && req.headers.authorization) {
		const DIDToken = req.headers.authorization.substring(7);
		try {
			const metadata = await magic.users.getMetadataByToken(DIDToken);
			console.log(metadata);
			const userInfo = await User.where({publickey: metadata.publicAddress});
			if (userInfo.length > 0) {
				console.log('User exists');
				res.send(userInfo);
			} else {
				const newUser = {
					email: metadata.email,
					publickey: metadata.publicAddress,
					earnings: '0',
					isActive: true,
					isEmailVerified: true,
					firstLogin: true,
				};
				try {
					await User.create(newUser);
					res.send(newUser);
				} catch (err) {
					console.log(err);
				}
			}
		} catch (err) {
			if (err instanceof SDKError) {
				console.log(err);
			}
		}
	}
});

export {router as authRouter};
