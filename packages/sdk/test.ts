import {fcl, FlowEnv, MatrixMarketTemplateNFTClient} from './src';
import {MatrixMarketTemplatePaymentMinterClient} from './src/client/MatrixMarketTemplatePaymentMinterClient';

async function main(){
  {
    let c = new MatrixMarketTemplatePaymentMinterClient();
    await c.bindFcl(fcl, FlowEnv.flowTestnet);
    c.bindAuth('0x7f3812b53dd4de20', '7a437e23da24e7772896c556262fafa58af9fde12890be5f33509c8ce8b94e64');
    
    let ret;

    //
    // try {
    //   ret = await c.deploy('FlowNiaMysteryBox', '0x7f3812b53dd4de20', '','FlowNiaMysteryBoxPresaleV2');
    //   console.log(`ret:`, ret);
    // } catch (e: any) {
    //   console.log(`e.message:`, e.message);
    // }

    // try {
    //   ret = await c.setSale('FlowNiaMysteryBoxPresaleV2', '0x7f3812b53dd4de20', '120.0','FLOW','0x7f3812b53dd4de20',undefined,undefined,'1000','0');
    //   console.log(`ret:`, ret);
    // } catch (e: any) {
    //   console.log(`e.message:`, e.message);
    // }
  
    try {
      ret = await c.paymentMintNFTs('FlowNiaMysteryBox','0x7f3812b53dd4de20','FlowNiaMysteryBoxPresaleV2', '0x7f3812b53dd4de20', '0x7f3812b53dd4de20', '5','120.0','FLOW');
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
      // ret=await c.checkNFTsCollection('FlowNiaMysteryBox', '0x7f3812b53dd4de20', '0x7f3812b53dd4de20')
      // console.log(`ret:`, ret);
      // ret=await c.initNFTCollection('FlowNiaMysteryBox', '0x7f3812b53dd4de20')
      ret = await c.getNFTs('FlowNiaMysteryBox', '0x7f3812b53dd4de20', '0x7f3812b53dd4de20');
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
