// language=Cadence
export const setSale: string = `
import _PAYMENT_MINTER_NAME_ from _PAYMENT_MINTER_ADDRESS_
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS
import FUSD from 0xFUSD_ADDRESS

transaction(
            price: UFix64,
            paymentToken: String,
            receiverAddr: Address,
            startTime: UFix64?,
            endTime: UFix64?,
            max: UInt64,
            current: UInt64) {
  let admin: &_PAYMENT_MINTER_NAME_.Administrator
  prepare(signer: AuthAccount) {
    self.admin = signer.borrow<&_PAYMENT_MINTER_NAME_.Administrator>(from: _PAYMENT_MINTER_NAME_.AdminStoragePath) ?? panic("Cannot borrow admin")
  }

  execute {
  
    var salePaymentVaultType = Type<@FlowToken.Vault>()
    var tokenReceiverPath = /public/flowTokenReceiver

    if(paymentToken == "FLOW"){
    
    } else if(paymentToken == "FUSD"){
        salePaymentVaultType = Type<@FUSD.Vault>()
        tokenReceiverPath = /public/fusdReceiver
    } else{
            panic("unsupported paymentToken")
    }
        
        let receiver = getAccount(receiverAddr).getCapability<&{FungibleToken.Receiver}>(tokenReceiverPath)!
        assert(receiver.check(), message: "Missing or mis-typed FungibleToken receiver")
        
    self.admin.setSale(sale: _PAYMENT_MINTER_NAME_.Sale(price,
            salePaymentVaultType,
            receiver,
             startTime,
             endTime,
             max,
             current))
  }
}
`;
