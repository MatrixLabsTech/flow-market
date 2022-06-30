const sleep = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));

export class BaseClient {
  protected fcl: any;
  
  protected async send(...args) {
    let ret;
    for (let i = 0; i < 3; i++) {
      try {
        ret = await this.fcl.send(...args);
        break;
      } catch (e: any) {
        if (e.statusCode === 400) {
          if (i == 2) {
            throw e;
          }
          console.log(`ignored e:`, e);
          await sleep(1000);
        } else {
          throw e;
        }
        
      }
    }
    return ret;
  }
}
