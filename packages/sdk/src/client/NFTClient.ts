import {MatrixMarketplaceNFT} from "./model";
import {FlowEnv} from "./env";

export interface NFTClient {
    setupGlobalFcl(env: FlowEnv): Promise<void>;
    FUSDBalance(address: string): Promise<number>;
    FLOWBalance(address: string): Promise<number>;
    checkNFTsCollection(address: string): Promise<boolean>;
    initNFTCollection(): Promise<string>;
    getNFTs(account: string): Promise<MatrixMarketplaceNFT[]>;
    mintNFTs(recipientBatch: [string], subCollectionIdBatch: [string], metadataBatch: [{string: string}]): Promise<boolean>;
}