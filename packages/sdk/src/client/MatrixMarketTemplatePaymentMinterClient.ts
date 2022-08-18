import * as t from '@onflow/types';
import {deployContract} from '../cadence/deployContract';
import {templateNFTCheckNFTsCollection} from '../cadence/TemplateNFT/check_nfts_collection';
import {templateNFTGetNFTScript} from '../cadence/TemplateNFT/get_nft';
import {templateNFTGetNFTsScript} from '../cadence/TemplateNFT/get_nfts';
import {templateNFTInitNFTCollection} from '../cadence/TemplateNFT/init_nfts_collection';
import {MatrixMarketTemplateNFT} from '../cadence/TemplateNFT/MatrixMarketTemplateNFT';
import {templateNFTMintNFTs} from '../cadence/TemplateNFT/mint_nfts';
import {setSale} from '../cadence/TemplatePaymentMinter/setSale';
import {TemplatePaymentMinter} from '../cadence/TemplatePaymentMinter/TemplatePaymentMinter';
import {paymentMintNFTs} from '../cadence/TemplatePaymentMinter/paymentMintNFTs';
import {getPrice} from '../cadence/TemplatePaymentMinter/getPrice';
import {getRemaining} from '../cadence/TemplatePaymentMinter/getRemaining';
import {updateContract} from '../cadence/updateContract';
import {BaseClient, handleScript, handleTx} from './BaseClient';

export class MatrixMarketTemplatePaymentMinterClient extends BaseClient {

    async codeDeploy(NFTName: string, NFTAddress:string, MetadataCode: string, PaymentMinterName = NFTName + 'Presale'): Promise<string> {
        return TemplatePaymentMinter.replace(/_NFT_NAME_/g, NFTName).replace(/_NFT_ADDRESS_/g, NFTAddress).replace(/_PAYMENT_MINTER_NAME_/g, PaymentMinterName).replace(/0xFUSD_ADDRESS/g, await this.fcl.config().get('0xFUSD_ADDRESS')).replace(/0xNON_FUNGIBLE_TOKEN_ADDRESS/g, await this.fcl.config().get('0xNON_FUNGIBLE_TOKEN_ADDRESS')).replace(/0xFUNGIBLE_TOKEN_ADDRESS/g, await this.fcl.config().get('0xFUNGIBLE_TOKEN_ADDRESS')).replace(/_METADATA_CODE_/g, MetadataCode)
    }
    
    @handleTx
    async deploy(NFTName: string, NFTAddress: string, MetadataCode: string, PaymentMinterName: string, {update = false} = {}): Promise<string> {
        let code = update ? updateContract : deployContract;
        return await this.send([
            this.fcl.transaction(code),
            this.fcl.args([
                this.fcl.arg(PaymentMinterName, t.String),
                this.fcl.arg(Buffer.from(TemplatePaymentMinter.replace(/_NFT_NAME_/g, NFTName).replace(/_NFT_ADDRESS_/g, NFTAddress).replace(/_PAYMENT_MINTER_NAME_/g, PaymentMinterName).replace(/0xFUSD_ADDRESS/g, await this.fcl.config().get('0xFUSD_ADDRESS')).replace(/0xNON_FUNGIBLE_TOKEN_ADDRESS/g, await this.fcl.config().get('0xNON_FUNGIBLE_TOKEN_ADDRESS')).replace(/0xFUNGIBLE_TOKEN_ADDRESS/g, await this.fcl.config().get('0xFUNGIBLE_TOKEN_ADDRESS')).replace(/_METADATA_CODE_/g, MetadataCode), 'utf8').toString('hex'), t.String)
            ]),
            this.fcl.proposer(this.getAuth()),
            this.fcl.authorizations([this.getAuth()]),
            this.fcl.limit(9999),
            this.fcl.payer(this.getAuth())
        ]);
    }
    
    @handleTx
    async paymentMintNFTs(NFTName: string, NFTAddress: string, PaymentMinterName: string, PaymentMinterAddress: string, recipient: string, count:string, price:string, paymentToken = 'FLOW', {collectionPublicPath = NFTName + '.CollectionPublicPath'} = {}): Promise<string> {
        return await this.send([
            this.fcl.transaction(paymentMintNFTs.replace(/_NFT_NAME_/g, NFTName).replace(/_NFT_ADDRESS_/g, NFTAddress).replace(/_COLLECTION_PUBLIC_PATH_/g, collectionPublicPath).replace(/_PAYMENT_MINTER_NAME_/g, PaymentMinterName).replace(/_PAYMENT_MINTER_ADDRESS_/g, PaymentMinterAddress)),
            this.fcl.args([this.fcl.arg(recipient, t.Address), this.fcl.arg(count, t.UInt64), this.fcl.arg(price, t.UFix64), this.fcl.arg(paymentToken, t.String)]),
            this.fcl.proposer(this.getAuth()),
            this.fcl.authorizations([this.getAuth()]),
            this.fcl.limit(9999),
            this.fcl.payer(this.getAuth())
        ]);
    }
    
    @handleTx
    async setSale(PaymentMinterName: string, PaymentMinterAddress: string, price: string,
             paymentToken: string,
             receiverAddr: string,
             startTime: string|undefined,
             endTime: string|undefined,
             max: string): Promise<string> {
        return await this.send([
            this.fcl.transaction(setSale.replace(/_PAYMENT_MINTER_NAME_/g, PaymentMinterName).replace(/_PAYMENT_MINTER_ADDRESS_/g, PaymentMinterAddress)),
            this.fcl.args([this.fcl.arg(price, t.UFix64),
                this.fcl.arg(paymentToken, t.String),
                this.fcl.arg(receiverAddr, t.Address),
                this.fcl.arg(startTime, t.Optional(t.UFix64)),
                this.fcl.arg(endTime, t.Optional(t.UFix64)),
                this.fcl.arg(max, t.UInt64)]),
            this.fcl.proposer(this.getAuth()),
            this.fcl.authorizations([this.getAuth()]),
            this.fcl.limit(9999),
            this.fcl.payer(this.getAuth())
        ]);
    }
    
    @handleScript
    async getPrice(PaymentMinterName: string, PaymentMinterAddress: string): Promise<string> {
        return await this.send([
            this.fcl.script(getPrice.replace(/_PAYMENT_MINTER_NAME_/g, PaymentMinterName).replace(/_PAYMENT_MINTER_ADDRESS_/g, PaymentMinterAddress)),
            this.fcl.limit(9999)
        ]);
    }
    
    @handleScript
    async getRemaining(PaymentMinterName: string, PaymentMinterAddress: string): Promise<string> {
        return await this.send([
            this.fcl.script(getRemaining.replace(/_PAYMENT_MINTER_NAME_/g, PaymentMinterName).replace(/_PAYMENT_MINTER_ADDRESS_/g, PaymentMinterAddress)),
            this.fcl.limit(9999)
        ]);
    }
}
