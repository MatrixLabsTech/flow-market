// language=Cadence
export const paymentMintNFTs: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS
import FUSD from 0xFUSD_ADDRESS
import __NFT_NAME__ from __NFT_ADDRESS__
import __PAYMENT_MINTER_NAME__ from __PAYMENT_MINTER_ADDRESS__

transaction(recipient: Address, count: UInt64, price: UFix64, paymentToken: String) {

  let vault: &FungibleToken.Vault
  let collection: &{NonFungibleToken.CollectionPublic}
  
  prepare(signer: AuthAccount) {
    assert(__PAYMENT_MINTER_NAME__.sale != nil,message:"sale closed")

    assert(__PAYMENT_MINTER_NAME__.sale!.max-__PAYMENT_MINTER_NAME__.sale!.current>=count,message:"sale items not enough")
    var tokenStoragePath = /storage/flowTokenVault

    if(paymentToken == "FLOW"){
    
    } else if(paymentToken == "FUSD"){
        tokenStoragePath = /storage/fusdVault
    } else{
        panic("unsupported paymentToken")
    }
    self.vault = signer.borrow<&FungibleToken.Vault>(from: tokenStoragePath)
            ?? panic("Cannot borrow vault from signer storage")
    
    self.collection = getAccount(recipient).getCapability(__COLLECTION_PUBLIC_PATH__).borrow<&{NonFungibleToken.CollectionPublic}>() ?? panic("Cannot borrow NFT collection receiver from account")
  }

  execute {
    var i = 0
    while i < Int(count) {
      __PAYMENT_MINTER_NAME__.paymentMint(payment: <- self.vault.withdraw(amount: price), recipient: self.collection)
      i = i + 1
    }
  }
}
`;
