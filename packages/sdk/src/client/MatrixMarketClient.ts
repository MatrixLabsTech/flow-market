import * as t from '@onflow/types';
import {checkCommon} from '../cadence/checkCommon';
import {checkNFTsCollection} from '../cadence/check_nfts_collection';
import {getFLOWBalanceScript} from '../cadence/get_flow_balance';
import {getFUSDBalanceScript} from '../cadence/get_fusd_balance';
import {getNFTsScript} from '../cadence/get_nfts';
import {initNFTCollection} from '../cadence/init_nfts_collection';
import {initCommon} from '../cadence/initCommon';
import {mintNFTs} from '../cadence/mint_nfts';
import {BaseClient, handleScript, handleTx} from './BaseClient';
import { checkNeedRepair } from '../cadence/checkNeedRepair';
import { repair } from '../cadence/repair';


export class MatrixMarketClient extends BaseClient {
    @handleTx
    public async mintNFTs(nftAdminAddress: string, recipientBatch: string[], subCollectionIdBatch: string[], metadataBatch: Array<Array<{ key: string, value: string }>>): Promise<string> {
        return await this.send([
                mintNFTs,
                this.fcl.args([this.fcl.arg(nftAdminAddress, t.Address), this.fcl.arg(recipientBatch, t.Array(t.Address)), this.fcl.arg(subCollectionIdBatch, t.Array(t.String)), this.fcl.arg(metadataBatch, t.Array(t.Dictionary({key: t.String, value: t.String})))]),
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(9999),
                this.fcl.payer(this.getAuth())
            ]);
    }
    
    @handleScript
    public async FLOWBalance(address: string): Promise<number> {
        return await this.send([
                getFLOWBalanceScript,
                this.fcl.args([this.fcl.arg(address, t.Address)]),
                this.fcl.limit(9999)
            ]);
    }
    
    @handleScript
    public async FUSDBalance(address: string): Promise<number> {
        return await this.send([
                getFUSDBalanceScript,
                this.fcl.args([this.fcl.arg(address, t.Address)]),
                this.fcl.limit(9999)
            ]);
    }
    
    @handleScript
    public async checkNFTsCollection(address: string): Promise<boolean> {
        return await this.send([
                checkNFTsCollection,
                this.fcl.args([this.fcl.arg(address, t.Address)]),
                this.fcl.limit(9999)
            ]);
    }
    
    @handleScript
    public async getNFTs(account: string): Promise<number[]> {
        return await this.send([getNFTsScript, this.fcl.args([this.fcl.arg(account, t.Address)]), this.fcl.limit(9999)]);
    }
    
    @handleTx
    public async initNFTCollection(): Promise<string> {
        return await this.send([
                initNFTCollection,
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(9999),
                this.fcl.payer(this.getAuth())
            ]);
    }
    
    @handleScript
    async checkCommon(address: string): Promise<boolean> {
        return this.send([
                this.fcl.script(checkCommon),
                this.fcl.args([this.fcl.arg(address, t.Address)]),
                this.fcl.limit(9999)
            ]);
    }
    
    @handleTx
    async initCommon(): Promise<string> {
        return await this.send([
                this.fcl.transaction(initCommon),
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(9999),
                this.fcl.payer(this.getAuth())
            ]);
    }
    
    @handleScript
    async checkNeedRepair(address: string): Promise<boolean> {
        return this.send([
                this.fcl.script(checkNeedRepair),
                this.fcl.args([this.fcl.arg(address, t.Address)]),
                this.fcl.limit(9999)
            ]);
    }
    
    @handleTx
    async repair(): Promise<string> {
        return await this.send([
                this.fcl.transaction(repair),
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(9999),
                this.fcl.payer(this.getAuth())
            ]);
    }
}
