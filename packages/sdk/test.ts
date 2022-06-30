import {fcl, FlowEnv, MatrixMarketClient} from './src';

async function main(){
  let c = new MatrixMarketClient();
  await c.bindFcl(fcl, FlowEnv.flowMainnet);
  c.bindAuth('0xa01dd6e82b7352be', '7a437e23da24e7772896c556262fafa58af9fde12890be5f33509c8ce8b94e64');
  
  let ret;
  ret = await c.FLOWBalance('0x88b4b1531847c1bc');
  console.log(`ret:`, ret);
  // ret = await c.mintNFTs('0x7f3812b53dd4de20', ['0xa56c5e5fd9b9ca22'], ['0'], [[{key: 'a', value: 'a'}]]);
  // console.log(`ret:`, ret);
  
}

main().catch(e=>{
  console.error(`e:`, e);
})
