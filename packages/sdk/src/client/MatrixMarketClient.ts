import * as t from '@onflow/types';
import {checkCommon} from '../cadence/checkCommon';
import {checkNFTsCollection} from '../cadence/check_nfts_collection';
import {getFLOWBalanceScript} from '../cadence/get_flow_balance';
import {getFUSDBalanceScript} from '../cadence/get_fusd_balance';
import {getNFTsScript} from '../cadence/get_nfts';
import {initNFTCollection} from '../cadence/init_nfts_collection';
import {initCommon} from '../cadence/initCommon';
import {mintNFTs} from '../cadence/mint_nfts';
import {BaseClient} from './BaseClient';


export class MatrixMarketClient extends BaseClient {
    
    public async mintNFTs(nftAdminAddress: string, recipientBatch: string[], subCollectionIdBatch: string[], metadataBatch: Array<Array<{ key: string, value: string }>>): Promise<string> {
        try {
            const response = await this.send([
                mintNFTs,
                this.fcl.args([this.fcl.arg(nftAdminAddress, t.Address), this.fcl.arg(recipientBatch, t.Array(t.Address)), this.fcl.arg(subCollectionIdBatch, t.Array(t.String)), this.fcl.arg(metadataBatch, t.Array(t.Dictionary({key: t.String, value: t.String})))]),
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(1000),
                this.fcl.payer(this.getAuth())
            ]);
            const ret = await this.fcl.tx(response).onceSealed();
            if (ret.errorMessage !== "" && ret.status != 4) {
                return Promise.reject(ret.errorMessage);
            }
            return response.transactionId;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
    
    public async FLOWBalance(address: string): Promise<number> {
        try {
            const response = await this.send([
                getFLOWBalanceScript,
                this.fcl.args([this.fcl.arg(address, t.Address)]),
                this.fcl.limit(1000)
            ]);
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject("Something is wrong with fetching FLOW balance");
        }
    }

    public async FUSDBalance(address: string): Promise<number> {
        try {
            const response = await this.send([
                getFUSDBalanceScript,
                this.fcl.args([this.fcl.arg(address, t.Address)]),
                this.fcl.limit(1000)
            ]);
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject("Something is wrong with fetching FUSD balance");
        }
    }

    public async checkNFTsCollection(address: string): Promise<boolean> {
        try {
            const response = await this.send([
                checkNFTsCollection,
                this.fcl.args([this.fcl.arg(address, t.Address)]),
                this.fcl.limit(1000)
            ]);
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
    
    public async getNFTs(account: string): Promise<number[]> {
        try {
            const response = await this.send([getNFTsScript, this.fcl.args([this.fcl.arg(account, t.Address)]), this.fcl.limit(2000)]);
            
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    public async initNFTCollection(): Promise<string> {
        try {
            const response = await this.send([
                initNFTCollection,
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(1000),
                this.fcl.payer(this.getAuth())
            ]);
            const ret = await this.fcl.tx(response).onceSealed();
            if (ret.errorMessage !== "" && ret.status != 4) {
                return Promise.reject(ret.errorMessage);
            }
            return response.transactionId;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
    
    async checkCommon(address: string): Promise<boolean> {
        try {
            const response = await this.send([
                this.fcl.script(checkCommon),
                this.fcl.args([this.fcl.arg(address, t.Address)]),
                this.fcl.limit(1000)
            ]);
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
    
    async initCommon(): Promise<string> {
        try {
            const response = await this.send([
                this.fcl.transaction(initCommon),
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(1000),
                this.fcl.payer(this.getAuth())
            ]);
            const ret = await this.fcl.tx(response).onceSealed();
            if (ret.errorMessage !== '' && ret.status != 4) {
                return Promise.reject(ret.errorMessage);
            }
            return response.transactionId;
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
}
