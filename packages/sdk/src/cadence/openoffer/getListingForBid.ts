import * as fcl from "@onflow/fcl";

// language=Cadence
export const getListingForBid: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS
import MatrixMarketOpenOffer from 0xOPENBID_ADDRESS
import FUSD from 0xFUSD_ADDRESS

import 0xsupportedNFTName from 0xsupportedNFTAddress
import NFTStorefront from 0xNFT_STOREFRONT

pub fun main(acct: Address, bidId: UInt64, openOfferAddress: Address): UInt64? {
    let openOffer = getAccount(openOfferAddress)
            .getCapability<&MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}>(
                MatrixMarketOpenOffer.OpenOfferPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow OpenOffer from provided address")

    let bid = openOffer.borrowOffer(bidId: bidId)
                    ?? panic("No Offer with that ID in OpenOffer")
    let nftId = bid.getDetails().nftId
    
    let storefront = getAccount(address)
        .getCapability(NFTStorefront.StorefrontPublicPath)
        .borrow<&{NFTStorefront.StorefrontPublic}>() ?? panic("StorefrontPublicPath not found")        let ids = self.storefront.getListingIDs()

        let toDelist: UInt64? = nil
        var i = 0

        while i < ids.length {
            let listing = storefront.borrowListing(listingResourceID: ids[i])
            ?? panic("No item with that ID")
            let detail = listing.getDetails()
            if(detail.nftType==Type<@0xsupportedNFTName.NFT>()&&detail.nftID==nftId){
                toDelist = ids[i]
                break
            }
        }
        return toDelist
}
`
