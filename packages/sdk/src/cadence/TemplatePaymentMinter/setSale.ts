// language=Cadence
export const setSale: string = `
import __PAYMENT_MINTER_NAME__ from __PAYMENT_MINTER_ADDRESS__
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS
import FUSD from 0xFUSD_ADDRESS

transaction(
            price: UFix64,
            paymentToken: String,
            receiverAddr: Address,
            startTime: UFix64?,
            endTime: UFix64?,
            max: UInt64) {
  let admin: &__PAYMENT_MINTER_NAME__.Administrator
  prepare(signer: AuthAccount) {
    self.admin = signer.borrow<&__PAYMENT_MINTER_NAME__.Administrator>(from: __PAYMENT_MINTER_NAME__.AdminStoragePath) ?? panic("Cannot borrow admin")
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
        var current = UInt64(0)
        if(__PAYMENT_MINTER_NAME__.sale !=nil){
            current = __PAYMENT_MINTER_NAME__.sale!.current
        }
    self.admin.setSale(sale: __PAYMENT_MINTER_NAME__.Sale(price,
            salePaymentVaultType,
            receiver,
             startTime,
             endTime,
             max,
             current))
  }
}
`;
