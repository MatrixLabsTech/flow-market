import t from '@onflow/types';
import {fcl, FlowEnv, MatrixMarketTemplateNFTClient} from './src';
import {MatrixMarketTemplatePaymentMinterClient} from './src/client/MatrixMarketTemplatePaymentMinterClient';

async function main(){
  {
    let c = new MatrixMarketTemplatePaymentMinterClient();
    await c.bindFcl(fcl, FlowEnv.flowTestnet);
    c.bindAuth('0x7f3812b53dd4de20', '7a437e23da24e7772896c556262fafa58af9fde12890be5f33509c8ce8b94e64');
    
    let ret;
//
//     try {
//       ret = await c.sendScript(`import _NFT_NAME_ from _NFT_ADDRESS_
// pub fun main(id: UInt64): String {
//     return _NFT_NAME_.getTokenURI(id: id)
// }
// `.replace(/_NFT_NAME_/g,'FlowNiaTest01').replace(/_NFT_ADDRESS_/g,'0x7f3812b53dd4de20'), [fcl.arg('1', t.UInt64),]);
//       // ret: /1
//       console.log(`ret:`, ret);
//     } catch (e: any) {
//       // error: value of type `FlowNiaMysteryBox` has no member `getBaseURI`
//       console.log(`e.message:`, e.message);
//     }


    try {
      ret = await c.deploy('FlowNiaTest01', '0x7f3812b53dd4de20', ``, 'FlowNiaPresaleTest01');
      console.log(`ret:`, ret);
    } catch (e: any) {
      console.log(`e.message:`, e.message);
    }

    try {
      ret = await c.setSale('FlowNiaPresaleTest01', '0x7f3812b53dd4de20', '120.0','FLOW','0xa56c5e5fd9b9ca22','1658199600.0',undefined,'1000','0');
      console.log(`ret:`, ret);
    } catch (e: any) {
      console.log(`e.message:`, e.message);
    }

    try {
      ret = await c.paymentMintNFTs('FlowNiaTest01','0x7f3812b53dd4de20','FlowNiaPresaleTest01', '0x7f3812b53dd4de20', '0x7f3812b53dd4de20', '5','120.0','FLOW');
      console.log(`ret:`, ret);
    } catch (e: any) {
      console.log(`e.message:`, e.message);
    }
    
  }

  {
    let c = new MatrixMarketTemplateNFTClient();
    await c.bindFcl(fcl, FlowEnv.flowTestnet);
    c.bindAuth('0x7f3812b53dd4de20', '7a437e23da24e7772896c556262fafa58af9fde12890be5f33509c8ce8b94e64');

    let ret;
    try {
      // ret = await c.deployWithTokenURI('FlowNia','',{update: true})
      // console.log(`ret:`, ret);
      // ret=await c.checkNFTsCollection('FlowNiaMysteryBox', '0x7f3812b53dd4de20', '0x7f3812b53dd4de20')
      // console.log(`ret:`, ret);
      // ret=await c.initNFTCollection('FlowNiaMysteryBox', '0x7f3812b53dd4de20')
      ret = await c.getNFTs('FlowNiaTest01', '0x7f3812b53dd4de20', '0x7f3812b53dd4de20');
      console.log(`ret:`, ret);
    } catch (e: any) {
      console.log(`e.message:`, e.message);
    }
  }
  // ret = await c.mintNFTs('0x7f3812b53dd4de20', ['0xa56c5e5fd9b9ca22'], ['0'], [[{key: 'a', value: 'a'}]]);
  // console.log(`ret:`, ret);
  
}

main().catch(e=>{
  console.error(`e:`, e);
})
