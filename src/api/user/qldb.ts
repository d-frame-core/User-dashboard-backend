import { QldbDriver, RetryConfig, TransactionExecutor } from "amazon-qldb-driver-nodejs";
import { dom } from "ion-js";

async function fetchDocuments(txn: TransactionExecutor): Promise<dom.Value[]> {
    return (await txn.execute("SELECT * FROM USER_ADDRESS_IPFS_CID WHERE User_Public_Address = ?", "xfyatsfxafx7777")).getResultList();
}

async function main(): Promise<void> {

    const retryLimit: number = 3;
    const retryConfig: RetryConfig = new RetryConfig(retryLimit);

    const driver: QldbDriver = new QldbDriver("IPFSCIDLedger", retryConfig );

    const resultList: dom.Value[] = await driver.executeLambda(async (txn: TransactionExecutor) => {
        console.log("Fetching document");
        return await fetchDocuments(txn);
    });

    console.log("The result List is ", JSON.stringify(resultList, null, 2));
    driver.close();

}

if (require.main === module) {
    main();
}