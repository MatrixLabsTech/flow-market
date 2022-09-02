import {checkOpenOffer} from '../cadence/openoffer/check_openoffer';
import {BaseClient, handleScript, handleTx} from './BaseClient';


import {acceptOffer} from "../cadence/openoffer/accept_offer";
import {initOpenOffer} from "../cadence/openoffer/init_openoffer";
import {openOffer} from "../cadence/openoffer/open_offer";
import {getOfferDetails} from "../cadence/openoffer/read_offer_details";
import {getOfferIds} from "../cadence/openoffer/read_openoffer_ids";
import {removeOpenOffer} from "../cadence/openoffer/remove_offer";

import * as t from "@onflow/types";

export class MatrixMarketOpenOfferClient extends BaseClient {
    @handleScript
    public async checkOpenOffer(address: string): Promise<boolean> {
        return await this.send([
                checkOpenOffer,
                this.fcl.args([this.fcl.arg(address, t.Address)]),
                this.fcl.limit(9999)
            ]);
    }
    
    @handleTx
    public async acceptOffer(listed: string[], supportedNFTName: string, supportedNFTAddress: string, offerResourceId: number, openOfferAddress: string, {collectionStoragePath = supportedNFTName+'.CollectionStoragePath'}={}): Promise<string> {
        return await this.send([
                this.fcl.transaction(acceptOffer.replace(/0xsupportedNFTName/g, supportedNFTName).replace(/0xsupportedNFTAddress/g, supportedNFTAddress).replace(/__COLLECTION_STORAGE_PATH__/g, collectionStoragePath)),
                this.fcl.args([this.fcl.arg(listed, t.Array(t.UInt64)), this.fcl.arg(offerResourceId, t.UInt64), this.fcl.arg(openOfferAddress, t.Address)]),
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(9999),
                this.fcl.payer(this.getAuth())
            ]);
    }
    
    @handleTx
    public async initOpenOffer(): Promise<string> {
        return await this.send([
                initOpenOffer,
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(9999),
                this.fcl.payer(this.getAuth())
            ]);
    }
    
    @handleTx
    public async openOffer(supportedNFTName:string, supportedNFTAddress:string,nftId: number, amount: string, paymentToken: string, royaltyReceivers: string[], royaltyAmount: string[], expirationTime: string, {collectionPublicPath=supportedNFTName+'.CollectionPublicPath'}={}): Promise<string> {
        return await this.send([
                this.fcl.transaction(openOffer.replace(/0xsupportedNFTName/g, supportedNFTName).replace(/0xsupportedNFTAddress/g, supportedNFTAddress).replace(/__COLLECTION_PUBLIC_PATH__/g, collectionPublicPath)),
                this.fcl.args([
                  this.fcl.arg(nftId, t.UInt64),
                    this.fcl.arg(amount, t.UFix64),
                    this.fcl.arg(paymentToken, t.String),
                    this.fcl.arg(royaltyReceivers, t.Array(t.Address)),
                    this.fcl.arg(royaltyAmount, t.Array(t.UFix64)),
                    this.fcl.arg(expirationTime, t.UFix64),
                ]),
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(9999),
                this.fcl.payer(this.getAuth())
            ]);
    }
    
    @handleTx
    public async removeOffer(offerResourceId: number): Promise<string> {
        return await this.send([
                removeOpenOffer,
                this.fcl.args([this.fcl.arg(offerResourceId, t.UInt64)]),
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(9999),
                this.fcl.payer(this.getAuth())
            ]);
    }
    
    @handleScript
    public async getOfferIds(account: string): Promise<number[]> {
        return await this.send([getOfferIds, this.fcl.args([this.fcl.arg(account, t.Address)]), this.fcl.limit(9999)]);
    }
    
    @handleScript
    public async getOfferDetails(account: string, offerResourceId: number): Promise<string> {
        return await this.send([getOfferDetails, this.fcl.args([this.fcl.arg(account, t.Address), this.fcl.arg(offerResourceId, t.UInt64)]), this.fcl.limit(9999)]);
    }
}
