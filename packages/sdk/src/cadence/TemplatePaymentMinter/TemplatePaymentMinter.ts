// language=Cadence
export const TemplatePaymentMinter = `import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import __NFT_NAME__ from __NFT_ADDRESS__


pub contract __PAYMENT_MINTER_NAME__ {
    pub let AdminStoragePath: StoragePath
    pub var sale: Sale?

    pub struct Sale {
        pub var price: UFix64
        pub var paymentVaultType: Type
        pub var receiver: Capability<&{FungibleToken.Receiver}>
        pub var startTime: UFix64?
        pub var endTime: UFix64?
        pub var max: UInt64
        pub var current: UInt64
        init(price: UFix64,
             paymentVaultType: Type,
             receiver: Capability<&{FungibleToken.Receiver}>,
             startTime: UFix64?,
             endTime: UFix64?,
             max: UInt64,
             current: UInt64){
            self.price= price
            self.paymentVaultType=paymentVaultType
            self.receiver=receiver
            self.startTime=startTime
            self.endTime=endTime
            self.max=max
            self.current=current
        }
        access(contract) fun incCurrent(){
            self.current = self.current + UInt64(1)
        }
    }
    
    pub fun paymentMint(
        payment: @FungibleToken.Vault,
        recipient: &{NonFungibleToken.CollectionPublic}
    ){
        pre {
            self.sale != nil: "sale closed"
            self.sale!.startTime == nil || self.sale!.startTime! <= getCurrentBlock().timestamp: "sale not started yet"
            self.sale!.endTime == nil || self.sale!.endTime! > getCurrentBlock().timestamp: "sale already ended"
            self.sale!.max > self.sale!.current: "sale items sold out"
            self.sale!.receiver.check(): "invalid receiver"
            payment.isInstance(self.sale!.paymentVaultType): "payment vault is not requested fungible token"
            payment.balance == self.sale!.price!: "payment vault does not contain requested price"
        }
        
        let receiver = self.sale!.receiver.borrow()!

        receiver.deposit(from: <- payment)

        let minter = self.account.borrow<&__NFT_NAME__.NFTMinter>(from: __NFT_NAME__.MinterStoragePath)!
        let metadata: {String:String} = {}
        let tokenId = __NFT_NAME__.totalSupply
        // metadata code here
        __METADATA_CODE__
        
        minter.mintNFT(recipient: recipient, metadata: metadata)
        
        self.sale!.incCurrent()
    }

    pub resource Administrator {
        pub fun setSale(sale:Sale?){
            __PAYMENT_MINTER_NAME__.sale = sale
        }
    }
    
    init() {
        self.sale = nil

        self.AdminStoragePath = /storage/_PAYMENT_MINTER_NAME_Admin
        self.account.save(<- create Administrator(), to: self.AdminStoragePath)
    }
}
`
