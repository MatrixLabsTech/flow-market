import t from '@onflow/types';
import {fcl, FlowEnv, MatrixMarketTemplateNFTClient} from './src';
import {MatrixMarketTemplatePaymentMinterClient} from './src/client/MatrixMarketTemplatePaymentMinterClient';

async function main(){
  {
    let c = new MatrixMarketTemplateNFTClient();
    await c.bindFcl(fcl, FlowEnv.flowMainnet);
    c.bindAuth('0xafb8473247d9354c', process.env.PrivateKey);
    
    let ret;
    try {
      ret = await c.sendTx(`
      import FlowNia from 0xafb8473247d9354c
transaction {
  prepare(signer: AuthAccount) {
    let admin = signer.borrow<&FlowNia.Admin>(from: FlowNia.AdminStoragePath) ?? panic("Cannot borrow admin")
    admin.setBaseURI(baseURI: "https://chainbase-api.matrixlabs.org/metadata/api/v1/apps/ethereum:mainnet:1IEzdAr_iDJvek3-CE1-p/contracts/0x60E4d786628Fea6478F785A6d7e704777c86a7c6_ethereum/metadata/tokens")
  }
}
      ` )
      console.log(`ret:`, ret);
      // ret=await c.checkNFTsCollection('FlowNiaMysteryBox', '0x7f3812b53dd4de20', '0x7f3812b53dd4de20')
      // console.log(`ret:`, ret);
      // ret=await c.initNFTCollection('FlowNiaMysteryBox', '0x7f3812b53dd4de20')
      ret = await c.getNFTs('FlowNia', '0xafb8473247d9354c', '0xafb8473247d9354c');
      console.log(`ret:`, ret);
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
