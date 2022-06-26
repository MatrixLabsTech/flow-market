import {fcl, FlowEnv, MatrixMarketClient} from './src';

async function main(){
  let c = new MatrixMarketClient();
  await c.bindFcl(fcl, FlowEnv.flowTestnet);
  c.bindAuth('0xa56c5e5fd9b9ca22', '7a437e23da24e7772896c556262fafa58af9fde12890be5f33509c8ce8b94e64');
  
  let ret;
  ret = await c.checkCommon('0xfdc077b6cb80a8ee');
  console.log(`ret:`, ret);
  // ret = await c.mintNFTs('0x7f3812b53dd4de20', ['0xa56c5e5fd9b9ca22'], ['0'], [[{key: 'a', value: 'a'}]]);
  // console.log(`ret:`, ret);
  
}

main().catch(e=>{
  console.error(`e:`, e);
})
