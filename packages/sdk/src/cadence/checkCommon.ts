import * as fcl from "@onflow/fcl";

// language=Cadence
export const checkCommon: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MatrixMarket from 0xNFT_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import NFTStorefront from 0xNFT_STOREFRONT
import MatrixMarketOpenOffer from 0xOPENBID_ADDRESS
import FUSD from 0xFUSD_ADDRESS

pub fun main(addr: Address): Bool {
    var ok = true
    
    ok = getAccount(addr).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver).check()
    if(!ok){return false}
    
    ok = getAccount(addr).getCapability<&{FungibleToken.Balance}>(/public/flowTokenBalance).check()
    if(!ok){return false}
    
    ok = getAccount(addr).getCapability<&{FungibleToken.Receiver}>(/public/fusdReceiver).check()
    if(!ok){return false}
    
    ok = getAccount(addr).getCapability<&FUSD.Vault{FungibleToken.Balance}>(/public/fusdBalance).check()
    if(!ok){return false}

    ok = !getAccount(addr).getCapability<&{NonFungibleToken.Provider}>(MatrixMarket.CollectionPublicPath).check()
    if(!ok){return false}
    
    ok = getAccount(addr).getCapability<&{NonFungibleToken.CollectionPublic}>(MatrixMarket.CollectionPublicPath).check()
    if(!ok){return false}
    
    ok = getAccount(addr).getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath).check()
    if(!ok){return false}
    
    ok = getAccount(addr).getCapability<&MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}>(MatrixMarketOpenOffer.OpenOfferPublicPath).check()
    if(!ok){return false}
    
    return true
}`;
