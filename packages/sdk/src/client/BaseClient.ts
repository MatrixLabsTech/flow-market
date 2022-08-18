import {FlowEnv} from './env';
import {FlowService} from './flow';

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
  
  public async bindFcl(fcl: any, env: FlowEnv): Promise<void> {
    this.env = env;
    this.fcl = fcl;
    switch (env) {
      case FlowEnv.flowTestnet: {
        await this.fcl
          .config()
          .put('accessNode.api', 'https://rest-testnet.onflow.org') // connect to Flow testnet
          .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn') // use Blocto testnet wallet
          .put('discovery.authn.endpoint', 'https://fcl-discovery.onflow.org/api/testnet/authn')
          .put('discovery.authn.include', ['0x33f75ff0b830dcec']) // add Lilico as include
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
          .put('discovery.authn.endpoint', 'https://fcl-discovery.onflow.org/api/authn')
          .put('discovery.authn.include', ['0x33f75ff0b830dcec']) // add Lilico as include
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
  @handleTx
  public async sendTx(code: string, args: Array<any> =[]){
    return await this.send([
      this.fcl.transaction(code),
      this.fcl.args(args),
      this.fcl.proposer(this.getAuth()),
      this.fcl.authorizations([this.getAuth()]),
      this.fcl.limit(9999),
      this.fcl.payer(this.getAuth())
    ]);
  }
  
  @handleScript
  public async sendScript(code:string, args: Array<any> = []) {
    return await this.send([
      this.fcl.script(code),
      this.fcl.args(args)
    ]);
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

export function handleTransaction(target: any, propertyName: any, descriptor: any) {
  const method = descriptor.value;
  
  descriptor.value = async function (...args: any) {
    try {
      let ret = await method.apply(this, args);
      if (ret.errorMessage && ret.status != 4) {
        return Promise.reject(ret.errorMessage);
      }
    } catch (error) {
    }
  };
}

export function handleScript(target: any, propertyName: any, descriptor: any) {
  const method = descriptor.value;
  
  descriptor.value = async function (...args: any) {
    try {
      let ret = await method.apply(this, args);
      return this.fcl.decode(ret);
    } catch (error: any) {
      console.error(error);
      if (error.message && checkError(error.message)) {
        throw new Error(parseError(error.message));
      } else {
        throw error;
      }
    }
  };
}

export function handleTx(target: any, propertyName: any, descriptor: any) {
  const method = descriptor.value;
  
  descriptor.value = async function (...args: any) {
    try {
      const response = await method.apply(this, args);
      const ret = await this.fcl.tx(response).onceSealed();
      if (ret.errorMessage && ret.status != 4) {
        console.error(ret.errorMessage);
        return Promise.reject(new Error(parseError(ret.errorMessage)));
      }
      return response.transactionId;
    } catch (error: any) {
      console.error(error);
      if (error.message && checkError(error.message)) {
        throw new Error(parseError(error.message));
      } else if (typeof error === 'string' && checkError(error)) {
        throw new Error(parseError(error));
      } else {
        throw error;
      }
    }
  };
}

function checkError(msg) {
  return msg.includes('[Error Code:')||msg.includes('failed to parse transaction Cadence script: Parsing failed:\n');
}

function parseError(msg) {
  if (msg.includes('[Error Code:')) {
    let matched = msg.match(/\[Error Code: .*?] (.*?\n.*?)\n/);
    if (matched && matched[1]) {
      return matched[1];
    }
  }else if(msg.includes('failed to parse transaction Cadence script: Parsing failed:\n')){
    let matched = msg.match(/failed to parse transaction Cadence script: Parsing failed:\n(.*?)\n/);
    if (matched && matched[1]) {
      return matched[1];
    }
  }
  return msg;
}
