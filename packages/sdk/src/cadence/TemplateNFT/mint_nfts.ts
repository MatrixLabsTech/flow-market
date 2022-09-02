// language=Cadence
export const templateNFTMintNFTs: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import __NFT_NAME__ from __NFT_ADDRESS__

transaction(recipientBatch: [Address], metadataBatch: [{String:String}]) {

  let minter: &__NFT_NAME__.NFTMinter

  prepare(acct: AuthAccount) {
    self.minter = acct.borrow<&__NFT_NAME__.NFTMinter>(from: __NFT_NAME__.MinterStoragePath)
            ?? panic("could not borrow minter reference")
  }

  execute {
    var size = recipientBatch.length
    // check all args length
    if (size != metadataBatch.length) {
      panic ("recipientBatch, subCollectionIdBatch, metadataBatch length not equal")
    }

    var i = 0
    while i < size {
      let recipientAccount = getAccount(recipientBatch[i])
      let metadata = metadataBatch[i]
      let recipient = recipientAccount.getCapability(__COLLECTION_PUBLIC_PATH__).borrow<&{NonFungibleToken.CollectionPublic}>() ?? panic("recipient collection not found")
      self.minter.mintNFT(recipient: recipient, metadata: metadata)
      
      i = i + 1
    }
  }
}`;
