import * as t from '@onflow/types';
import {deployContract} from '../cadence/deployContract';
import {templateNFTCheckNFTsCollection} from '../cadence/TemplateNFT/check_nfts_collection';
import {templateNFTGetNFTsScript} from '../cadence/TemplateNFT/get_nfts';
import {templateNFTInitNFTCollection} from '../cadence/TemplateNFT/init_nfts_collection';
import {MatrixMarketTemplateNFT} from '../cadence/TemplateNFT/MatrixMarketTemplateNFT';
import {templateNFTMintNFTs} from '../cadence/TemplateNFT/mint_nfts';
import {BaseClient} from './BaseClient';
import {FlowEnv} from './env';
import {FlowService} from './flow';

import {IBindConfigs} from './interfaces/NFTClient';
import {TemplateNFTClient} from './interfaces/TemplateNFTClient';

export class MatrixMarketTemplateNFTClient extends BaseClient implements TemplateNFTClient {
    async deploy(NFTName: string): Promise<string> {
        try {
            const response = await this.send([
                this.fcl.transaction(deployContract),
                this.fcl.args([
                    this.fcl.arg(NFTName, t.String),
                    this.fcl.arg(Buffer.from(MatrixMarketTemplateNFT.replace(/_NFT_NAME_/g, NFTName).replace(/0xNON_FUNGIBLE_TOKEN_ADDRESS/g, await this.fcl.config().get('0xNON_FUNGIBLE_TOKEN_ADDRESS')).replace(/0xMETADATA_VIEWS_ADDRESS/g, await this.fcl.config().get('0xMETADATA_VIEWS_ADDRESS')), 'utf8').toString('hex'), t.String)
                ]),
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(2000),
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
    
    async mintNFTs(NFTName: string, NFTAddress: string, recipientBatch: string[], subCollectionIdBatch: string[], metadataBatch: Array<Array<{ key: string, value: string }>>): Promise<string> {
        try {
            const response = await this.send([
                this.fcl.transaction(templateNFTMintNFTs.replace(/_NFT_NAME_/g, NFTName).replace(/_NFT_ADDRESS_/g, NFTAddress)),
                this.fcl.args([this.fcl.arg(recipientBatch, t.Array(t.Address)), this.fcl.arg(subCollectionIdBatch, t.Array(t.String)), this.fcl.arg(metadataBatch, t.Array(t.Dictionary({
                    key: t.String,
                    value: t.String
                })))]),
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
    
    async checkNFTsCollection(NFTName: string, NFTAddress: string, address: string): Promise<boolean> {
        try {
            const response = await this.send([
                this.fcl.script(templateNFTCheckNFTsCollection.replace(/_NFT_NAME_/g, NFTName).replace(/_NFT_ADDRESS_/g, NFTAddress)),
                this.fcl.args([this.fcl.arg(address, t.Address)]),
                this.fcl.limit(1000)
            ]);
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
    
    async getNFTs(NFTName: string, NFTAddress: string, account: string): Promise<number[]> {
        try {
            const response = await this.send([this.fcl.script(templateNFTGetNFTsScript.replace(/_NFT_NAME_/g, NFTName).replace(/_NFT_ADDRESS_/g, NFTAddress)), this.fcl.args([this.fcl.arg(account, t.Address)]), this.fcl.limit(2000)]);
            
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
    
    async initNFTCollection(NFTName: string, NFTAddress: string): Promise<string> {
        try {
            const response = await this.send([
                this.fcl.transaction(templateNFTInitNFTCollection.replace(/_NFT_NAME_/g, NFTName).replace(/_NFT_ADDRESS_/g, NFTAddress)),
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
