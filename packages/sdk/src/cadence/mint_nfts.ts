import * as fcl from "@onflow/fcl";
// language=Cadence
export const mintNFTs: string = fcl.transaction`
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MatrixMarket from 0xNFT_ADDRESS

transaction(nftAdminAddress: Address, recipientBatch: [Address], subCollectionIdBatch: [String], metadataBatch: [{String:String}]) {

  let minter: &MatrixMarket.NFTMinter

  prepare(acct: AuthAccount) {
    var minter = acct.borrow<&MatrixMarket.NFTMinter>(from: MatrixMarket.MinterStoragePath)
    if(minter == nil){
        let minterResource <- MatrixMarket.createNewMinter()
        acct.save(<-minterResource, to: MatrixMarket.MinterStoragePath)
        minter = acct.borrow<&MatrixMarket.NFTMinter>(from: MatrixMarket.MinterStoragePath)
    }
    
    self.minter = minter!
  }

  execute {
    var size = recipientBatch.length
    // check all args length
    if (size != subCollectionIdBatch.length || size != metadataBatch.length) {
      panic ("recipientBatch, subCollectionIdBatch, metadataBatch length not equal")
    }

    while size > 0 {
      let recipientAccount = getAccount(recipientBatch[size - 1])
      let subCollectionId = subCollectionIdBatch[size - 1]
      let metadata = metadataBatch[size - 1]
      let recipient = recipientAccount.getCapability(MatrixMarket.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>() ?? panic("recipient collection not found")
      self.minter.mintNFT(recipient: recipient, subCollectionId: subCollectionId, metadata: metadata)
      size = size - 1
    }
  }
}`;
