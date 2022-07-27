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
      let script  = `import NonFungibleToken from 0x1d7e57aa55817448
import MetadataViews from 0x1d7e57aa55817448
import Bl0x from 0x7620acf6d7f2468a
pub struct NFTCollectionDataPatched {
        /// Path in storage where this NFT is recommended to be stored.
        pub let storagePath: StoragePath

        /// Public path which must be linked to expose public capabilities of this NFT
        /// including standard NFT interfaces and metadataviews interfaces
        pub let publicPath: PublicPath

        /// Private path which should be linked to expose the provider
        /// capability to withdraw NFTs from the collection holding NFTs
        pub let providerPath: PrivatePath

        /// Public collection type that is expected to provide sufficient read-only access to standard
        /// functions (deposit + getIDs + borrowNFT)
        /// This field is for backwards compatibility with collections that have not used the standard
        /// NonFungibleToken.CollectionPublic interface when setting up collections. For new
        /// collections, this may be set to be equal to the type specified in \`publicLinkedType\`.
        pub let publicCollection: Type

        /// Type that should be linked at the aforementioned public path. This is normally a
        /// restricted type with many interfaces. Notably the \`NFT.CollectionPublic\`,
        /// \`NFT.Receiver\`, and \`MetadataViews.ResolverCollection\` interfaces are required.
        pub let publicLinkedType: Type

        /// Type that should be linked at the aforementioned private path. This is normally
        /// a restricted type with at a minimum the \`NFT.Provider\` interface
        pub let providerLinkedType: Type

        /// Function that allows creation of an empty NFT collection that is intended to store
        /// this NFT.
        // pub let createEmptyCollection: ((): @NonFungibleToken.Collection)

        init(
            storagePath: StoragePath,
            publicPath: PublicPath,
            providerPath: PrivatePath,
            publicCollection: Type,
            publicLinkedType: Type,
            providerLinkedType: Type,
            // createEmptyCollectionFunction: ((): @NonFungibleToken.Collection)
        ) {
            self.storagePath=storagePath
            self.publicPath=publicPath
            self.providerPath = providerPath
            self.publicCollection=publicCollection
            self.publicLinkedType=publicLinkedType
            self.providerLinkedType = providerLinkedType
        }
    }
pub struct NFTViewPatched {
        pub let id: UInt64
        pub let uuid: UInt64
        pub let display: MetadataViews.Display?
        pub let externalURL: MetadataViews.ExternalURL?
        pub let collectionData: NFTCollectionDataPatched?
        pub let collectionDisplay: MetadataViews.NFTCollectionDisplay?
        pub let royalties: MetadataViews.Royalties?
        pub let traits: MetadataViews.Traits?

        init(
            id : UInt64,
            uuid : UInt64,
            display : MetadataViews.Display?,
            externalURL : MetadataViews.ExternalURL?,
            collectionData : NFTCollectionDataPatched?,
            collectionDisplay : MetadataViews.NFTCollectionDisplay?,
            royalties : MetadataViews.Royalties?,
            traits: MetadataViews.Traits?
        ) {
            self.id = id
            self.uuid = uuid
            self.display = display
            self.externalURL = externalURL
            self.collectionData = collectionData
            self.collectionDisplay = collectionDisplay
            self.royalties = royalties
            self.traits = traits
        }
    }
pub fun main(address: Address, id: UInt64): AnyStruct?{
        let owner = getAccount(address)
        let col= owner
            .getCapability(Bl0x.CollectionPublicPath)
            .borrow<&{MetadataViews.ResolverCollection}>()
            ?? panic("NFT Collection not found")
        if col == nil { return nil }
        let nft = col!.borrowViewResolver(id: id)
        if nft == nil { return nil }
        // let views = nft!.getViews()
        // let ret:{String:AnyStruct?} = {}
        // for view in views{
        //     ret[view.identifier] = nft!.resolveView(view)
        // }
        //         let ret2:{String:AnyStruct?} = {}

        let nftView = MetadataViews.getNFTView(id: id, viewResolver: nft)
        if(nftView.collectionData != nil){
            let ret = NFTViewPatched(
                id : nftView.id,
                uuid : nftView.uuid,
                display : nftView.display,
                externalURL : nftView.externalURL,
                collectionData : NFTCollectionDataPatched(
                    storagePath: nftView.collectionData!.storagePath,
                    publicPath: nftView.collectionData!.publicPath,
                    providerPath: nftView.collectionData!.providerPath,
                    publicCollection: nftView.collectionData!.publicCollection,
                    publicLinkedType: nftView.collectionData!.publicLinkedType,
                    providerLinkedType: nftView.collectionData!.providerLinkedType
                ),
                collectionDisplay : nftView.collectionDisplay,
                royalties : nftView.royalties,
                traits: nftView.traits)
            return ret
        } else {
          return nftView
        }
}
`
      ret = await c.sendScript(script, [fcl.arg('0x18d7e8fd44629257', t.Address), fcl.arg('208475596', t.UInt64)]);

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
