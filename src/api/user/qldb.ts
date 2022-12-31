import { Agent } from  'https';
import { NodeHttpHandlerOptions } from "@aws-sdk/node-http-handler";
import { QLDBSessionClientConfig } from "@aws-sdk/client-qldb-session";
import { QldbDriver, RetryConfig, TransactionExecutor } from "amazon-qldb-driver-nodejs";

async function insertDocument(txn: TransactionExecutor): Promise<void> {
    const CID: Record<string, any> = {
        publicaddress: "0xyeyycw8e6ed8wyi23wtg",
        ipfscid: "eyf838tf3i4tegfhwdg"
    };
    await txn.execute("INSERT INTO IPFSCID ?", CID);
}

async function main(): Promise<void> {
    const maxConcurrentTransactions: number = 10;
    const agentForQldb: Agent = new Agent({
        maxSockets: maxConcurrentTransactions
    });

    const lowLevelClientHttpOptions: NodeHttpHandlerOptions = {
      httpAgent: agentForQldb
    };

    const serviceConfigurationOptions: QLDBSessionClientConfig = {
        region: "us-east-1"
    };

    const retryLimit: number = 4;
    const retryConfig: RetryConfig = new RetryConfig(retryLimit);
    const driver: QldbDriver = new QldbDriver("IPFSCIDLedger", serviceConfigurationOptions, lowLevelClientHttpOptions, maxConcurrentTransactions, retryConfig);
}

if (require.main === module) {
    main();
}