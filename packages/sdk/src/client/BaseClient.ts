import {FlowEnv} from './env';
import {FlowService} from './flow';
import {IBindConfigs} from './interfaces/NFTClient';

const sleep = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));

export class BaseClient {
  protected fcl: any;
  protected env: FlowEnv | undefined;
  protected currentAddress?: string;
  protected authMethod?: (account?: any) => Promise<any>
  
  /** Setup FCL instance
   *
   * @async
   * @returns {Promise<void>}
   * @param key
   * @param value
   */
  public async setupFcl(key: string, value: string): Promise<void> {
        await this.fcl
          .config()
          .put(key, value);
  }
  
  public bindAuth(flowAddress: string, privateKeyHex: string, accountIndex: number = 0) {
    this.currentAddress = flowAddress
    this.authMethod = new FlowService(flowAddress, privateKeyHex, accountIndex).authorize()
  }
  
  protected async getCurrentAddress() {
    return this.currentAddress || this.fcl.currentUser().snapshot().address
  }
  
  protected getAuth() {
    return this.authMethod || this.fcl.currentUser().authorization
  }
  
  public async bindFcl(fcl: any, env: FlowEnv, config?: IBindConfigs): Promise<void> {
    this.env = env;
    this.fcl = fcl;
    switch (env) {
      case FlowEnv.flowTestnet: {
        await this.fcl
          .config()
          .put("accessNode.api", "https://rest-testnet.onflow.org") // connect to Flow testnet
          .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn") // use Blocto testnet wallet
          .put('0xFUNGIBLE_TOKEN_ADDRESS', '0x9a0766d93b6608b7')
          .put('0xFUSD_ADDRESS', '0xe223d8a629e49c68')
          .put('0xFLOW_TOKEN_ADDRESS', '0x7e60df042a9c0868')
          .put('0xNFT_ADDRESS', '0x7f3812b53dd4de20')
          .put("0xOPENBID_ADDRESS", "0x7f3812b53dd4de20")
          .put('0xNON_FUNGIBLE_TOKEN_ADDRESS', '0x631e88ae7f1d7c20')
          .put('0xMETADATA_VIEWS_ADDRESS', '0x631e88ae7f1d7c20')
          .put('0xNFT_STOREFRONT', '0x7f3812b53dd4de20');
        break;
      }
      case FlowEnv.flowMainnet: {
        await this.fcl
          .config()
          .put("accessNode.api", "https://rest-mainnet.onflow.org")
          .put("discovery.wallet", "https://fcl-discovery.onflow.org/authn") // use Blocto wallet
          .put('0xFUNGIBLE_TOKEN_ADDRESS', '0xf233dcee88fe0abe')
          .put('0xFUSD_ADDRESS', '0x3c5959b568896393')
          .put('0xFLOW_TOKEN_ADDRESS', '0x1654653399040a61')
          .put('0xNFT_ADDRESS', '0x2162bbe13ade251e')
          .put("0xOPENBID_ADDRESS", "0x2162bbe13ade251e")
          .put('0xNON_FUNGIBLE_TOKEN_ADDRESS', '0x1d7e57aa55817448')
          .put('0xMETADATA_VIEWS_ADDRESS', '0x1d7e57aa55817448')
          .put('0xNFT_STOREFRONT', '0x4eb8a10cb9f87357');
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
          .put("0xOPENBID_ADDRESS", "0xf8d6e0586b0a20c7")
          .put('0xNON_FUNGIBLE_TOKEN_ADDRESS', '0xf8d6e0586b0a20c7')
          .put('0xMETADATA_VIEWS_ADDRESS', '0xf8d6e0586b0a20c7')
          .put('0xNFT_STOREFRONT', '0xf8d6e0586b0a20c7');
    }
  }
  
  protected async send(...args) {
    let ret;
    for (let i = 0; i < 3; i++) {
      try {
        ret = await this.fcl.send(...args);
        break;
      } catch (e: any) {
        if (e.statusCode === 400 && e?.errorMessage?.includes?.('failed to get account from the execution node')) {
          if (i == 2) {
            throw e;
          }
          console.log(`ignored e:`, e, Object.assign({}, e));
          await sleep(1000);
        } else {
          throw e;
        }
        
      }
    }
    return ret;
  }
}
