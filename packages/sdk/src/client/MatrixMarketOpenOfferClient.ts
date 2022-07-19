import {checkOpenOffer} from '../cadence/openoffer/check_openoffer';
import {BaseClient} from './BaseClient';


import {acceptOffer} from "../cadence/openoffer/accept_offer";
import {initOpenOffer} from "../cadence/openoffer/init_openoffer";
import {openOffer} from "../cadence/openoffer/open_offer";
import {getOfferDetails} from "../cadence/openoffer/read_offer_details";
import {getOfferIds} from "../cadence/openoffer/read_openoffer_ids";
import {removeOpenOffer} from "../cadence/openoffer/remove_offer";

import * as t from "@onflow/types";

export class MatrixMarketOpenOfferClient extends BaseClient {
    public async checkOpenOffer(address: string): Promise<boolean> {
        try {
            const response = await this.send([
                checkOpenOffer,
                this.fcl.args([this.fcl.arg(address, t.Address)]),
                this.fcl.limit(2000)
            ]);
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
    
    
    public async acceptOffer(supportedNFTName: string, supportedNFTAddress: string, offerResourceId: number, openOfferAddress: string): Promise<string> {
        try {
            const response = await this.send([
                this.fcl.transaction(acceptOffer.replace(/0xsupportedNFTName/g, supportedNFTName).replace(/0xsupportedNFTAddress/g, supportedNFTAddress)),
                this.fcl.args([this.fcl.arg(offerResourceId, t.UInt64), this.fcl.arg(openOfferAddress, t.Address)]),
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(2000),
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

    public async initOpenOffer(): Promise<string> {
        try {
            const response = await this.send([
                initOpenOffer,
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(2000),
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

    public async openOffer(supportedNFTName:string, supportedNFTAddress:string,nftId: number, amount: string, paymentToken: string, royaltyReceivers: string[], royaltyAmount: string[], expirationTime: string): Promise<string> {
        try {
            const response = await this.send([
                this.fcl.transaction(openOffer.replace(/0xsupportedNFTName/g, supportedNFTName).replace(/0xsupportedNFTAddress/g, supportedNFTAddress)),
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
                this.fcl.limit(2000),
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

    public async removeOffer(offerResourceId: number): Promise<string> {
        try {
            const response = await this.send([
                removeOpenOffer,
                this.fcl.args([this.fcl.arg(offerResourceId, t.UInt64)]),
                this.fcl.proposer(this.getAuth()),
                this.fcl.authorizations([this.getAuth()]),
                this.fcl.limit(2000),
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

    public async getOfferIds(account: string): Promise<number[]> {
        try {
            const response = await this.send([getOfferIds, this.fcl.args([this.fcl.arg(account, t.Address)]), this.fcl.limit(2000)]);
            
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    public async getOfferDetails(account: string, offerResourceId: number): Promise<string> {
        try {
            const response = await this.send([getOfferDetails, this.fcl.args([this.fcl.arg(account, t.Address), this.fcl.arg(offerResourceId, t.UInt64)]), this.fcl.limit(2000)]);
            
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }


}
