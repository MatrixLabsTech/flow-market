import * as t from '@onflow/types';
import {transferCoin} from '../cadence/TemplateNFT/transferCoin';
import { transferNFT } from '../cadence/TemplateNFT/transferNFT';
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
        return MatrixMarketTemplateNFTWithTokenURI.replace(/__BASE_URI__/g, baseURI).replace(/__NFT_NAME__/g, NFTName).replace(/0xNON_FUNGIBLE_TOKEN_ADDRESS/g, await this.fcl.config().get('0xNON_FUNGIBLE_TOKEN_ADDRESS')).replace(/0xMETADATA_VIEWS_ADDRESS/g, await this.fcl.config().get('0xMETADATA_VIEWS_ADDRESS'))
    }
    
    @handleTx
    async deployWithTokenURI(NFTName: string, baseURI = '', {update = false} = {}): Promise<string> {
        let code = update ? updateContract : deployContract;
        return await this.send([
            this.fcl.transaction(code),
            this.fcl.args([
                this.fcl.arg(NFTName, t.String),
                this.fcl.arg(Buffer.from(MatrixMarketTemplateNFTWithTokenURI.replace(/__BASE_URI__/g, baseURI).replace(/__NFT_NAME__/g, NFTName).replace(/0xNON_FUNGIBLE_TOKEN_ADDRESS/g, await this.fcl.config().get('0xNON_FUNGIBLE_TOKEN_ADDRESS')).replace(/0xMETADATA_VIEWS_ADDRESS/g, await this.fcl.config().get('0xMETADATA_VIEWS_ADDRESS')), 'utf8').toString('hex'), t.String)
            ]),
            this.fcl.proposer(this.getAuth()),
            this.fcl.authorizations([this.getAuth()]),
            this.fcl.limit(9999),
            this.fcl.payer(this.getAuth())
        ]);
    }
    
    async codeDeploy(NFTName: string): Promise<string> {
        return MatrixMarketTemplateNFT.replace(/__NFT_NAME__/g, NFTName).replace(/0xNON_FUNGIBLE_TOKEN_ADDRESS/g, await this.fcl.config().get('0xNON_FUNGIBLE_TOKEN_ADDRESS')).replace(/0xMETADATA_VIEWS_ADDRESS/g, await this.fcl.config().get('0xMETADATA_VIEWS_ADDRESS'))
    }
    
    @handleTx
    async deploy(NFTName: string, {update = false} = {}): Promise<string> {
        let code = update ? updateContract : deployContract;
        return await this.send([
            this.fcl.transaction(code),
            this.fcl.args([
                this.fcl.arg(NFTName, t.String),
                this.fcl.arg(Buffer.from(MatrixMarketTemplateNFT.replace(/__NFT_NAME__/g, NFTName).replace(/0xNON_FUNGIBLE_TOKEN_ADDRESS/g, await this.fcl.config().get('0xNON_FUNGIBLE_TOKEN_ADDRESS')).replace(/0xMETADATA_VIEWS_ADDRESS/g, await this.fcl.config().get('0xMETADATA_VIEWS_ADDRESS')), 'utf8').toString('hex'), t.String)
            ]),
            this.fcl.proposer(this.getAuth()),
            this.fcl.authorizations([this.getAuth()]),
            this.fcl.limit(9999),
            this.fcl.payer(this.getAuth())
        ]);
    }
    
    @handleTx
    async transferCoin(coinName: string, coinAddress: string, amount: string, receiver: string,{
        vaultStoragePath,
      receiverPublicPath
    }:{
        vaultStoragePath:string,
        receiverPublicPath:string
    }){
        return await this.send([
            this.fcl.transaction(transferCoin.replace(/__COIN_NAME__/g, coinName).replace(/__COIN_ADDRESS__/g, coinAddress).replace(/__VAULT_STORAGE_PATH__/g, vaultStoragePath).replace(/__RECEIVER_PUBLIC_PATH__/g, receiverPublicPath)),
            this.fcl.args([this.fcl.arg(amount, t.UFix64), this.fcl.arg(receiver, t.Address)]),
            this.fcl.proposer(this.getAuth()),
            this.fcl.authorizations([this.getAuth()]),
            this.fcl.limit(9999),
            this.fcl.payer(this.getAuth())
        ]);
    }
    @handleTx
    async transferNFT(NFTName: string, NFTAddress: string, recipient: string, withdrawID: string, {collectionPublicPath = NFTName + '.CollectionPublicPath',
        collectionStoragePath = NFTName + '.CollectionStoragePath'} = {}): Promise<string> {
        return await this.send([
            this.fcl.transaction(transferNFT.replace(/__NFT_NAME__/g, NFTName).replace(/__NFT_ADDRESS__/g, NFTAddress).replace(/__COLLECTION_PUBLIC_PATH__/g, collectionPublicPath).replace(/__COLLECTION_STORAGE_PATH__/g, collectionStoragePath)),
            this.fcl.args([this.fcl.arg(recipient, t.Address), this.fcl.arg(withdrawID, t.UInt64)]),
            this.fcl.proposer(this.getAuth()),
            this.fcl.authorizations([this.getAuth()]),
            this.fcl.limit(9999),
            this.fcl.payer(this.getAuth())
        ]);
    }
    
    @handleTx
    async mintNFTs(NFTName: string, NFTAddress: string, recipientBatch: string[], metadataBatch: Array<Array<{ key: string, value: string }>>, {collectionPublicPath = NFTName + '.CollectionPublicPath'} = {}): Promise<string> {
        return await this.send([
            this.fcl.transaction(templateNFTMintNFTs.replace(/__NFT_NAME__/g, NFTName).replace(/__NFT_ADDRESS__/g, NFTAddress).replace(/__COLLECTION_PUBLIC_PATH__/g, collectionPublicPath)),
            this.fcl.args([this.fcl.arg(recipientBatch, t.Array(t.Address)), this.fcl.arg(metadataBatch, t.Array(t.Dictionary({
                key: t.String,
                value: t.String
            })))]),
            this.fcl.proposer(this.getAuth()),
            this.fcl.authorizations([this.getAuth()]),
            this.fcl.limit(9999),
            this.fcl.payer(this.getAuth())
        ]);
    }
    
    @handleScript
    async checkNFTsCollection(NFTName: string, NFTAddress: string, address: string, {collectionPublicPath = NFTName + '.CollectionPublicPath'} = {}): Promise<boolean> {
        return await this.send([
            this.fcl.script(templateNFTCheckNFTsCollection.replace(/__NFT_NAME__/g, NFTName).replace(/__NFT_ADDRESS__/g, NFTAddress).replace(/__COLLECTION_PUBLIC_PATH__/g, collectionPublicPath)),
            this.fcl.args([this.fcl.arg(address, t.Address)]),
            this.fcl.limit(9999)
        ]);
    }
    
    @handleScript
    async getNFTs(NFTName: string, NFTAddress: string, account: string, {collectionPublicPath = NFTName + '.CollectionPublicPath'} = {}): Promise<number[]> {
        return await this.send([this.fcl.script(templateNFTGetNFTsScript.replace(/__NFT_NAME__/g, NFTName).replace(/__NFT_ADDRESS__/g, NFTAddress).replace(/__COLLECTION_PUBLIC_PATH__/g, collectionPublicPath)), this.fcl.args([this.fcl.arg(account, t.Address)]), this.fcl.limit(9999)]);
    }
    
    @handleScript
    async getNFT(NFTName: string, NFTAddress: string, account: string, id: number, {collectionPublicPath = NFTName + '.CollectionPublicPath'} = {}): Promise<any> {
        return await this.send([this.fcl.script(templateNFTGetNFTScript.replace(/__NFT_NAME__/g, NFTName).replace(/__NFT_ADDRESS__/g, NFTAddress).replace(/__COLLECTION_PUBLIC_PATH__/g, collectionPublicPath)), this.fcl.args([this.fcl.arg(account, t.Address), this.fcl.arg(id, t.UInt64)]), this.fcl.limit(9999)]);
    }
    
    @handleTx
    async initNFTCollection(NFTName: string, NFTAddress: string, {
        collectionPublicPath = NFTName + '.CollectionPublicPath',
        collectionStoragePath = NFTName + '.CollectionStoragePath',
        publicCollectionName = '',
        hasMetadataViewResolver = false
    } = {}): Promise<string> {
        let collectionLinks=''
        if(hasMetadataViewResolver){
            collectionLinks+=', MetadataViews.ResolverCollection'
        }
        if(publicCollectionName){
            let parts = publicCollectionName.split(',').map(v=>v.trim())
            let i = parts.indexOf('NonFungibleToken.CollectionPublic')
            if(i !== -1){
                parts.splice(i,1)
            }
            i = parts.indexOf('NonFungibleToken.Receiver')
            if (i !== -1) {
                parts.splice(i, 1)
            }
            if(hasMetadataViewResolver){
                i = parts.indexOf('MetadataViews.ResolverCollection')
                if (i !== -1) {
                    parts.splice(i, 1)
                }
            }
            publicCollectionName = parts.join(', ')
        }
        if(publicCollectionName !== ''){
            collectionLinks+=', '+ publicCollectionName
        }
        return await this.send([
            this.fcl.transaction(templateNFTInitNFTCollection.replace(/__NFT_NAME__/g, NFTName).replace(/__NFT_ADDRESS__/g, NFTAddress).replace(/__COLLECTION_PUBLIC_PATH__/g, collectionPublicPath).replace(/__COLLECTION_STORAGE_PATH__/g, collectionStoragePath).replace(/__COLLECTION_LINKS__/g,collectionLinks)),
            this.fcl.proposer(this.getAuth()),
            this.fcl.authorizations([this.getAuth()]),
            this.fcl.limit(9999),
            this.fcl.payer(this.getAuth())
        ]);
    }
}
