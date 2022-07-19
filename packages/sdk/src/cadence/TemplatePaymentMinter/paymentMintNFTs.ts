// language=Cadence
export const paymentMintNFTs: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS
import FUSD from 0xFUSD_ADDRESS
import _NFT_NAME_ from _NFT_ADDRESS_
import _PAYMENT_MINTER_NAME_ from _PAYMENT_MINTER_ADDRESS_

transaction(recipient: Address, count: UInt64, price: UFix64, paymentToken: String) {

  let vault: &FungibleToken.Vault
  let collection: &{NonFungibleToken.CollectionPublic}
  
  prepare(signer: AuthAccount) {
    assert(_PAYMENT_MINTER_NAME_.sale != nil,message:"sale closed")

    assert(_PAYMENT_MINTER_NAME_.sale!.max-_PAYMENT_MINTER_NAME_.sale!.current>=count,message:"sale items not enough")
    var tokenStoragePath = /storage/flowTokenVault

    if(paymentToken == "FLOW"){
    
    } else if(paymentToken == "FUSD"){
        tokenStoragePath = /storage/fusdVault
    } else{
        panic("unsupported paymentToken")
    }
    self.vault = signer.borrow<&FungibleToken.Vault>(from: tokenStoragePath)
            ?? panic("Cannot borrow vault from signer storage")
    
    self.collection = getAccount(recipient).getCapability(_COLLECTION_PUBLIC_PATH_).borrow<&{NonFungibleToken.CollectionPublic}>() ?? panic("Cannot borrow NFT collection receiver from account")
  }

  execute {
    var i = 0
    while i < Int(count) {
      _PAYMENT_MINTER_NAME_.paymentMint(payment: <- self.vault.withdraw(amount: price), recipient: self.collection)
      i = i + 1
    }
  }
}
`;
