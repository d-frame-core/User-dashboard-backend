import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {validateRequest} from './../../../common/middlewares/validate-request';
import {AESService} from '../../utils/AES';

const router = express.Router();
const AES = new AESService();

router.post(
	'/api/admin/encrypt',
	[body().notEmpty().withMessage('Please provide object to be encrypted')],
	validateRequest,
	async (req: Request, res: Response) => {
		const dataToBeEncrypted = req.body;
		try {
			const encryptedDigest = AES.encrypt(dataToBeEncrypted);
			res.status(200).json({message: 'Encryption Successful', data: encryptedDigest});
		} catch (err) {
			res.status(500).json(err);
		}
	},
);

router.post(
	'/api/admin/decrypt',
	[body('digest').exists().withMessage('Please provide digest to be decrypted')],
	validateRequest,
	async (req: Request, res: Response) => {
		const encryptedDigest = req.body.digest;
		try {
			const data = AES.decrypt(encryptedDigest);
			res.status(200).json({message: 'Decryption Successful', data});
		} catch (err) {
			res.status(500).json(err);
		}
	},
);

export {router as adminRouter};
