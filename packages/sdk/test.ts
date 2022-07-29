import t from '@onflow/types';
import {fcl, FlowEnv, MatrixMarketTemplateNFTClient} from './src';
import {MatrixMarketTemplatePaymentMinterClient} from './src/client/MatrixMarketTemplatePaymentMinterClient';

async function main(){
  {
    let c = new MatrixMarketTemplateNFTClient();
    await c.bindFcl(fcl, FlowEnv.flowMainnet);
    c.bindAuth('0x7f3812b53dd4de20', '7a437e23da24e7772896c556262fafa58af9fde12890be5f33509c8ce8b94e64');
  
    let ret;
    try {
      ret = await c.sendScript(`transaction {

  prepare(signer: AuthAccount) {
    signer.unlink(/public/MatrixWorldVoucherCollection)
    let res <- signer.load<@AnyResource>(from: /storage/MatrixWorldVoucherCollection)
    destroy res
  }
  
  }`, [fcl.arg('0xdd2919f21a3b53d8', t.Address)]);

      console.log(`ret:`, ret);
      // ret=await c.checkNFTsCollection('FlowNiaMysteryBox', '0x7f3812b53dd4de20', '0x7f3812b53dd4de20')
      // console.log(`ret:`, ret);
      // ret=await c.initNFTCollection('FlowNiaMysteryBox', '0x7f3812b53dd4de20')
     
    } catch (e: any) {
      console.log(`e.message:`, e.message);
    }
    
    try {
      ret = await c.deployWithTokenURI('FlowNia','')
      console.log(`ret:`, ret);
      // ret=await c.checkNFTsCollection('FlowNiaMysteryBox', '0x7f3812b53dd4de20', '0x7f3812b53dd4de20')
      // console.log(`ret:`, ret);
      // ret=await c.initNFTCollection('FlowNiaMysteryBox', '0x7f3812b53dd4de20')
      ret = await c.getNFTs('FlowNia', '0xafb8473247d9354c', '0xafb8473247d9354c');
      console.log(`ret:`, ret);
    } catch (e: any) {
      console.log(`e.message:`, e.message);
    }
  }
  {
    let c = new MatrixMarketTemplatePaymentMinterClient();
    await c.bindFcl(fcl, FlowEnv.flowMainnet);
    c.bindAuth('0xafb8473247d9354c', process.env.PrivateKey);
    
    let ret;

//     try {
//       ret = await c.sendScript(`import _NFT_NAME_ from _NFT_ADDRESS_
// pub fun main(): UInt64 {
//     return _NFT_NAME_.sale!.current
// }
// `.replace(/_NFT_NAME_/g,'FlowNiaPresaleTest01').replace(/_NFT_ADDRESS_/g,'0x7f3812b53dd4de20'));
//       // ret: /1
//       console.log(`ret:`, ret);
//     } catch (e: any) {
//       // error: value of type `FlowNiaMysteryBox` has no member `getBaseURI`
//       console.log(`e.message:`, e.message);
//     }


    try {
      ret = await c.deploy('FlowNia', '0xafb8473247d9354c', ``, 'FlowNiaPresale');
      console.log(`ret:`, ret);
    } catch (e: any) {
      console.log(`e.message:`, e.message);
    }

    try {
      ret = await c.setSale('FlowNiaPresale', '0xafb8473247d9354c', '99.0','FLOW','0x88272af02d8011b8','1658286000.0',undefined,'1000');
      console.log(`ret:`, ret);
    } catch (e: any) {
      console.log(`e.message:`, e.message);
    }
    //
    // try {
    //   ret = await c.paymentMintNFTs('FlowNiaTest01','0x7f3812b53dd4de20','FlowNiaPresaleTest01', '0x7f3812b53dd4de20', '0x7f3812b53dd4de20', '5','120.0','FLOW');
    //   console.log(`ret:`, ret);
    // } catch (e: any) {
    //   console.log(`e.message:`, e.message);
    // }
    
  }

  
  // ret = await c.mintNFTs('0x7f3812b53dd4de20', ['0xa56c5e5fd9b9ca22'], ['0'], [[{key: 'a', value: 'a'}]]);
  // console.log(`ret:`, ret);
  
}

main().catch(e=>{
  console.error(`e:`, e);
})
