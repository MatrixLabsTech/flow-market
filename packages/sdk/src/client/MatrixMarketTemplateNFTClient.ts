import * as t from '@onflow/types';
import {deployContract} from '../cadence/deployContract';
import {templateNFTCheckNFTsCollection} from '../cadence/TemplateNFT/check_nfts_collection';
import {templateNFTGetNFTScript} from '../cadence/TemplateNFT/get_nft';
import {templateNFTGetNFTsScript} from '../cadence/TemplateNFT/get_nfts';
import {templateNFTInitNFTCollection} from '../cadence/TemplateNFT/init_nfts_collection';
import {MatrixMarketTemplateNFT} from '../cadence/TemplateNFT/MatrixMarketTemplateNFT';
import {MatrixMarketTemplateNFTWithTokenURI} from '../cadence/TemplateNFT/MatrixMarketTemplateNFTWithTokenURI';
import {templateNFTMintNFTs} from '../cadence/TemplateNFT/mint_nfts';
import {updateContract} from '../cadence/updateContract';
import {BaseClient, handleScript, handleTx} from './BaseClient';

export class MatrixMarketTemplateNFTClient extends BaseClient {
    
    async codeDeployWithTokenURI(NFTName: string, baseURI = ''): Promise<string> {
        return MatrixMarketTemplateNFTWithTokenURI.replace(/_BASE_URI_/g, baseURI).replace(/_NFT_NAME_/g, NFTName).replace(/0xNON_FUNGIBLE_TOKEN_ADDRESS/g, await this.fcl.config().get('0xNON_FUNGIBLE_TOKEN_ADDRESS')).replace(/0xMETADATA_VIEWS_ADDRESS/g, await this.fcl.config().get('0xMETADATA_VIEWS_ADDRESS'))
    }
    
    @handleTx
    async deployWithTokenURI(NFTName: string, baseURI = '', {update = false} = {}): Promise<string> {
        let code = update ? updateContract : deployContract;
        return await this.send([
            this.fcl.transaction(code),
            this.fcl.args([
                this.fcl.arg(NFTName, t.String),
                this.fcl.arg(Buffer.from(MatrixMarketTemplateNFTWithTokenURI.replace(/_BASE_URI_/g, baseURI).replace(/_NFT_NAME_/g, NFTName).replace(/0xNON_FUNGIBLE_TOKEN_ADDRESS/g, await this.fcl.config().get('0xNON_FUNGIBLE_TOKEN_ADDRESS')).replace(/0xMETADATA_VIEWS_ADDRESS/g, await this.fcl.config().get('0xMETADATA_VIEWS_ADDRESS')), 'utf8').toString('hex'), t.String)
            ]),
            this.fcl.proposer(this.getAuth()),
            this.fcl.authorizations([this.getAuth()]),
            this.fcl.limit(2000),
            this.fcl.payer(this.getAuth())
        ]);
    }
    
    async codeDeploy(NFTName: string): Promise<string> {
        return MatrixMarketTemplateNFT.replace(/_NFT_NAME_/g, NFTName).replace(/0xNON_FUNGIBLE_TOKEN_ADDRESS/g, await this.fcl.config().get('0xNON_FUNGIBLE_TOKEN_ADDRESS')).replace(/0xMETADATA_VIEWS_ADDRESS/g, await this.fcl.config().get('0xMETADATA_VIEWS_ADDRESS'))
    }
    
    @handleTx
    async deploy(NFTName: string, {update = false} = {}): Promise<string> {
        let code = update ? updateContract : deployContract;
        return await this.send([
            this.fcl.transaction(code),
            this.fcl.args([
                this.fcl.arg(NFTName, t.String),
                this.fcl.arg(Buffer.from(MatrixMarketTemplateNFT.replace(/_NFT_NAME_/g, NFTName).replace(/0xNON_FUNGIBLE_TOKEN_ADDRESS/g, await this.fcl.config().get('0xNON_FUNGIBLE_TOKEN_ADDRESS')).replace(/0xMETADATA_VIEWS_ADDRESS/g, await this.fcl.config().get('0xMETADATA_VIEWS_ADDRESS')), 'utf8').toString('hex'), t.String)
            ]),
            this.fcl.proposer(this.getAuth()),
            this.fcl.authorizations([this.getAuth()]),
            this.fcl.limit(2000),
            this.fcl.payer(this.getAuth())
        ]);
    }
    
    @handleTx
    async mintNFTs(NFTName: string, NFTAddress: string, recipientBatch: string[], metadataBatch: Array<Array<{ key: string, value: string }>>, {collectionPublicPath = NFTName + '.CollectionPublicPath'} = {}): Promise<string> {
        return await this.send([
            this.fcl.transaction(templateNFTMintNFTs.replace(/_NFT_NAME_/g, NFTName).replace(/_NFT_ADDRESS_/g, NFTAddress).replace(/_COLLECTION_PUBLIC_PATH_/g, collectionPublicPath)),
            this.fcl.args([this.fcl.arg(recipientBatch, t.Array(t.Address)), this.fcl.arg(metadataBatch, t.Array(t.Dictionary({
                key: t.String,
                value: t.String
            })))]),
            this.fcl.proposer(this.getAuth()),
            this.fcl.authorizations([this.getAuth()]),
            this.fcl.limit(1000),
            this.fcl.payer(this.getAuth())
        ]);
    }
    
    @handleScript
    async checkNFTsCollection(NFTName: string, NFTAddress: string, address: string, {collectionPublicPath = NFTName + '.CollectionPublicPath'} = {}): Promise<boolean> {
        return await this.send([
            this.fcl.script(templateNFTCheckNFTsCollection.replace(/_NFT_NAME_/g, NFTName).replace(/_NFT_ADDRESS_/g, NFTAddress).replace(/_COLLECTION_PUBLIC_PATH_/g, collectionPublicPath)),
            this.fcl.args([this.fcl.arg(address, t.Address)]),
            this.fcl.limit(1000)
        ]);
    }
    
    @handleScript
    async getNFTs(NFTName: string, NFTAddress: string, account: string, {collectionPublicPath = NFTName + '.CollectionPublicPath'} = {}): Promise<number[]> {
        return await this.send([this.fcl.script(templateNFTGetNFTsScript.replace(/_NFT_NAME_/g, NFTName).replace(/_NFT_ADDRESS_/g, NFTAddress).replace(/_COLLECTION_PUBLIC_PATH_/g, collectionPublicPath)), this.fcl.args([this.fcl.arg(account, t.Address)]), this.fcl.limit(2000)]);
    }
    
    @handleScript
    async getNFT(NFTName: string, NFTAddress: string, account: string, id: number, {collectionPublicPath = NFTName + '.CollectionPublicPath'} = {}): Promise<any> {
        return await this.send([this.fcl.script(templateNFTGetNFTScript.replace(/_NFT_NAME_/g, NFTName).replace(/_NFT_ADDRESS_/g, NFTAddress).replace(/_COLLECTION_PUBLIC_PATH_/g, collectionPublicPath)), this.fcl.args([this.fcl.arg(account, t.Address), this.fcl.arg(id, t.UInt64)]), this.fcl.limit(2000)]);
    }
    
    @handleTx
    async initNFTCollection(NFTName: string, NFTAddress: string, {
        collectionPublicPath = NFTName + '.CollectionPublicPath',
        collectionStoragePath = NFTName + '.CollectionStoragePath'
    } = {}): Promise<string> {
        return await this.send([
            this.fcl.transaction(templateNFTInitNFTCollection.replace(/_NFT_NAME_/g, NFTName).replace(/_NFT_ADDRESS_/g, NFTAddress).replace(/_COLLECTION_PUBLIC_PATH_/g, collectionPublicPath).replace(/_COLLECTION_STORAGE_PATH_/g, collectionStoragePath)),
            this.fcl.proposer(this.getAuth()),
            this.fcl.authorizations([this.getAuth()]),
            this.fcl.limit(1000),
            this.fcl.payer(this.getAuth())
        ]);
    }
}
