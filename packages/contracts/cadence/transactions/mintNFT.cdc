// SetupAccount2Transaction.cdc
import FungibleToken from "../contracts/lib/FungibleToken.cdc"
import MatrixMarket from "../contracts/MatrixMarket.cdc"
import FlowToken from "../contracts/lib/FlowToken.cdc"
import NonFungibleToken from "../contracts/lib/NonFungibleToken.cdc"

// This transaction adds an empty Vault to account 0x02
// and mints an NFT with id=1 that is deposited into
// the NFT collection on account 0x01.
transaction(nftAdminAddress: Address, recipientBatch: [Address], subCollectionIdBatch: [String], metadataBatch: [{String: String}]) {

  let minter: &MatrixMarket.NFTMinter
  let creator: AuthAccount

  prepare(acct: AuthAccount) {
      self.minter = getAccount(nftAdminAddress).getCapability(MatrixMarket.MinterPublicPath)
                                    .borrow<&MatrixMarket.NFTMinter>()
                                    ?? panic("Could not borrow minter capability from public collection")
      self.creator = acct;
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
      self.minter.mintNFT(creator: self.creator, recipient: recipient, subCollectionId: subCollectionId, metadata: metadata)
      size = size - 1
    }
  }
}
