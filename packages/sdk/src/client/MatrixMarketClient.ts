import * as t from '@onflow/types';
import {checkCommon} from '../cadence/checkCommon';
import {checkNFTsCollection} from '../cadence/check_nfts_collection';
import {getFLOWBalanceScript} from '../cadence/get_flow_balance';
import {getFUSDBalanceScript} from '../cadence/get_fusd_balance';
import {getNFTsScript} from '../cadence/get_nfts';
import {initNFTCollection} from '../cadence/init_nfts_collection';
import {initCommon} from '../cadence/initCommon';
import {mintNFTs} from '../cadence/mint_nfts';
import {FlowEnv} from './env';
import {FlowService} from './flow';
import {IBindConfigs, NFTClient} from './interfaces/NFTClient';


export class MatrixMarketClient implements NFTClient {
    private fcl: any;
    
    private env: FlowEnv | undefined;
    
    private authMethod?: (account?: any) => Promise<any>;
    
    public async bindFcl(fcl: any, env: FlowEnv, config?: IBindConfigs): Promise<void> {
        this.env = env;
        this.fcl = fcl;
        switch (env) {
            case FlowEnv.flowTestnet: {
                await this.fcl
                  .config()
                  .put('accessNode.api', 'https://rest-testnet.onflow.org') // connect to Flow testnet
                  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn') // use Blocto testnet wallet
                  .put('0xFUNGIBLE_TOKEN_ADDRESS', '0x9a0766d93b6608b7')
                  .put('0xFUSD_ADDRESS', '0xe223d8a629e49c68')
                  .put('0xFLOW_TOKEN_ADDRESS', '0x7e60df042a9c0868')
                  .put('0xNFT_ADDRESS', '0x7f3812b53dd4de20')
                  .put('0xNON_FUNGIBLE_TOKEN_ADDRESS', '0x631e88ae7f1d7c20')
                  .put('0xOPENBID_ADDRESS', '0x7f3812b53dd4de20')
                  .put('0xNFT_STOREFRONT', '0x7f3812b53dd4de20');
                break;
            }
            case FlowEnv.flowMainnet: {
                await this.fcl
                  .config()
                  .put('accessNode.api', 'https://rest-mainnet.onflow.org')
                  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/authn') // use Blocto wallet
                  .put('0xFUNGIBLE_TOKEN_ADDRESS', '0xf233dcee88fe0abe')
                  .put('0xFUSD_ADDRESS', '0x3c5959b568896393')
                  .put('0xFLOW_TOKEN_ADDRESS', '0x1654653399040a61')
                  .put('0xNFT_ADDRESS', '')
                  .put('0xNON_FUNGIBLE_TOKEN_ADDRESS', '0x1d7e57aa55817448')
                  .put('0xOPENBID_ADDRESS', '0x7f3812b53dd4de20')
                  .put('0xNFT_STOREFRONT', '0x4eb8a10cb9f87357')
                ;
                break;
            }
            case FlowEnv.localEmulator:
            default:
                await this.fcl
                  .config()
                  .put('accessNode.api', 'http://localhost:8080')
                  .put('discovery.wallet', 'http://localhost:8701/fcl/authn')
                  .put('0xFUNGIBLE_TOKEN_ADDRESS', '0xee82856bf20e2aa6')
                  .put('0xFUSD_ADDRESS', '0xf8d6e0586b0a20c7')
                  .put('0xFLOW_TOKEN_ADDRESS', '0x0ae53cb6e3f42a79')
                  .put('0xNFT_ADDRESS', '0xf8d6e0586b0a20c7')
                  .put('0xNON_FUNGIBLE_TOKEN_ADDRESS', '0xf8d6e0586b0a20c7');
        }
    }
    
    /** Setup FCL instance
     *
     * @async
     * @param {key} - example:"0xNFT_ADDRESS"
     * @param {value} - example:"0x7f3812b53dd4de20"
     * @returns {Promise<void>}
     */
    public async setupFcl(key: string, value: string): Promise<void> {
        switch (this.env) {
            case FlowEnv.flowTestnet: {
                await this.fcl
                  .config()
                  .put(key, value);
                break;
            }
            case FlowEnv.flowTestnet: {
                await this.fcl
                  .config()
                  .put(key, value);
                break;
            }
            case FlowEnv.flowTestnet: {
                await this.fcl
                  .config()
                  .put(key, value);
                break;
            }
        }
    }
    
    public bindAuth(flowAddress: string, privateKeyHex: string, accountIndex: number = 0) {
        this.authMethod = new FlowService(flowAddress, privateKeyHex, accountIndex).authorize()
    }
    
    private getAuth() {
        return this.authMethod || this.fcl.currentUser().authorization
    }
    
    public async mintNFTs(nftAdminAddress: string, recipientBatch: string[], subCollectionIdBatch: string[], metadataBatch: Array<Array<{ key: string, value: string }>>): Promise<string> {
        try {
            const response = await this.fcl.send([
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
            const response = await this.fcl.send([
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
            const response = await this.fcl.send([
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
            const response = await this.fcl.send([
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
            const response = await this.fcl.send([getNFTsScript, this.fcl.args([this.fcl.arg(account, t.Address)]), this.fcl.limit(2000)]);
            
            return this.fcl.decode(response);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    public async initNFTCollection(): Promise<string> {
        try {
            const response = await this.fcl.send([
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
            const response = await this.fcl.send([
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
            const response = await this.fcl.send([
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
