import Cryptr from 'cryptr';
import config from '../config/';

export class AESService {
	private cryptrInstance: Cryptr;
	constructor() {
		this.cryptrInstance = new Cryptr(config.aesGcmKey);
	}
	encrypt(data: unknown): string {
		if (this.cryptrInstance) {
			const encryptedString = this.cryptrInstance.encrypt(JSON.stringify(data));
			return encryptedString;
		}
		throw new Error('Encryption Failed');
	}

	decrypt(encryptedDigest: string): unknown {
		if (this.cryptrInstance) {
			const decryptedString = this.cryptrInstance.decrypt(encryptedDigest);
			return JSON.parse(decryptedString);
		}
	}
}
