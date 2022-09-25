import { EmitHint } from "typescript"
import Web3 from "web3"

const bn = require('bn.js')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const { POSClient, setProofApi, use } = require('@maticnetwork/maticjs')
const SCALING_FACTOR = new bn(10).pow(new bn(18))
const { Web3ClientPlugin } = require('@maticnetwork/maticjs-web3')
var Hashes = require('jshashes')
// import {AESService} from '../../utils/AES';
const abi = require('./contract_abi.json')
var CronJob = require('cron').CronJob;
// trigger on every second, 10, 20, 30, 40, 50, 00
const pattern = '0 0 23 * * *';

// const AES = new AESService();

use(Web3ClientPlugin)

// if (config.proofApi) {
//   setProofApi(config.proofApi)
// }

const privateKey = "df430d089dfb2186a36a4fd945681fb70bdd6c56269114422e6ce0db6ca726e4"
const userAddress = "0x7B4fd15B495b5700aF2C193f52D830e51C049366"

const localKeyProvider = new HDWalletProvider(privateKey, 'https://rpc-mumbai.maticvigil.com')
let web3 = new Web3(localKeyProvider)

const getPOSClient = (network = 'testnet', version = 'mumbai') => {
  const posClient = new POSClient()
  return posClient.init({
    log: true,
    network: network,
    version: version,
    child: {
      provider: new HDWalletProvider(privateKey, 'https://rpc-mumbai.maticvigil.com'),
      defaultConfig: {
        from: userAddress,
      },
    },
    parent: {
      provider: new HDWalletProvider(privateKey, 'https://rpc-mumbai.maticvigil.com'),
      defaultConfig: {
        from: userAddress,
      },
    },
  })
}



const execute = async () => {
    try {
        var str = 'This is a sample text!'
        // new SHA1 instance and base64 string encoding
        var SHA256 = new Hashes.SHA256().b64(str)
        // var encrypted_data = AES.encrypt(str)

        var contract = new web3.eth.Contract(abi, "0x6452E784664E4161EAB0D24fE062FfcaD71f8b01")
        console.log(contract)
        contract.methods.addItem(String(web3.utils.toHex(SHA256))).send({from: "0x7B4fd15B495b5700aF2C193f52D830e51C049366", gasPrice: '30000000000'})
        .on('transactionHash', function(hash: string){
          console.log("hash is", hash)
        })
        .on('receipt', function(receipt: any){
          console.log("receipt is", receipt)
        })
        .on('error', function(error: any, receipt: any) {
          console.log(error, receipt)
        });


    } catch(err) {
        console.log(err)
    }  
}

const job = new CronJob(pattern, execute);
job.start()