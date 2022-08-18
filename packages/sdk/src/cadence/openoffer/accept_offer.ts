import * as fcl from "@onflow/fcl";

// language=Cadence
export const acceptOffer: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS
import MatrixMarketOpenOffer from 0xOPENBID_ADDRESS
import FUSD from 0xFUSD_ADDRESS

import 0xsupportedNFTName from 0xsupportedNFTAddress
import NFTStorefront from 0xNFT_STOREFRONT

transaction(listed: [UInt64], bidId: UInt64, openOfferAddress: Address) {
    let nft: @NonFungibleToken.NFT
    let receiver: &{FungibleToken.Receiver}
    let openOffer: &MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}
    let bid: &MatrixMarketOpenOffer.Offer{MatrixMarketOpenOffer.OfferPublic}
    
    let storefront: &NFTStorefront.Storefront

    prepare(acct: AuthAccount) {
        self.openOffer = getAccount(openOfferAddress)
            .getCapability<&MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}>(
                MatrixMarketOpenOffer.OpenOfferPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow OpenOffer from provided address")

        self.bid = self.openOffer.borrowOffer(bidId: bidId)
                    ?? panic("No Offer with that ID in OpenOffer")
                    
        let nftId = self.bid.getDetails().nftId
        self.storefront = acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) ?? panic("can't borrow storefront")
        
        let nftCollection = acct.borrow<&0xsupportedNFTName.Collection>(
            from: 0xsupportedNFTName.CollectionStoragePath
        ) ?? panic("Cannot borrow NFT collection receiver from account")
        self.nft <- nftCollection.withdraw(withdrawID: nftId)

        let salePaymentVaultType = self.bid.getDetails().vaultType
        var tokenReceiverPath = /public/flowTokenReceiver

        if(salePaymentVaultType == Type<@FlowToken.Vault>()){
        
        }else if(salePaymentVaultType == Type<@FUSD.Vault>()){
            tokenReceiverPath = /public/fusdReceiver
        }else{
            panic("unsupported paymentToken")
        }
        self.receiver = acct.getCapability(tokenReceiverPath)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Could not borrow receiver reference to the recipient's Vault")
    }

    execute {
        let vault <- self.bid.purchase(item: <-self.nft)!
        self.receiver.deposit(from: <-vault)
        self.openOffer.cleanup(bidId: bidId)
        if listed.length > 0 {
            for id in listed {
                self.storefront.removeListing(listingResourceID: id)
            }
        }
    }
}`;
