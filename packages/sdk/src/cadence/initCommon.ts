import * as fcl from "@onflow/fcl";

// language=Cadence
export const initCommon: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MatrixMarket from 0xNFT_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import NFTStorefront from 0xNFT_STOREFRONT
import MatrixMarketOpenOffer from 0xOPENBID_ADDRESS
import FUSD from 0xFUSD_ADDRESS

transaction {
    prepare(acct: AuthAccount) {
        // init Flow
        acct.link<&FungibleToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>
            (/public/flowTokenReceiver, target: /storage/flowTokenVault)
        
        acct.link<&FungibleToken.Vault{FungibleToken.Balance}>
            (/public/flowTokenBalance, target: /storage/flowTokenVault)
            
        // init FUSD
        if acct.borrow<&FungibleToken.Vault>(from: /storage/fusdVault) == nil {
            acct.save(<- FUSD.createEmptyVault(), to: /storage/fusdVault)
        }
        acct.link<&FUSD.Vault{FungibleToken.Receiver}>
            (/public/fusdReceiver, target: /storage/fusdVault)
        acct.link<&FUSD.Vault{FungibleToken.Balance}>
            (/public/fusdBalance, target: /storage/fusdVault)
            
        // init MatrixMarket
        if acct.borrow<&MatrixMarket.Collection>(from: MatrixMarket.CollectionStoragePath) == nil {
            let collection <- MatrixMarket.createEmptyCollection() as! @MatrixMarket.Collection
            acct.save(<-collection, to: MatrixMarket.CollectionStoragePath)
            acct.link<&{MatrixMarket.MatrixMarketCollectionPublic,NonFungibleToken.Receiver,NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(MatrixMarket.CollectionPublicPath, target: MatrixMarket.CollectionStoragePath)
        }
        
        // init Storefront
        if acct.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath) == nil {
            acct.save<@NFTStorefront.Storefront>(<- NFTStorefront.createStorefront(), to: NFTStorefront.StorefrontStoragePath)
            acct.link<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath)
        }
        
        // init OpenOffer
        if acct.borrow<&MatrixMarketOpenOffer.OpenOffer>(from: MatrixMarketOpenOffer.OpenOfferStoragePath) == nil {
            let OpenOffer <- MatrixMarketOpenOffer.createOpenOffer() as! @MatrixMarketOpenOffer.OpenOffer
            acct.save(<-OpenOffer, to: MatrixMarketOpenOffer.OpenOfferStoragePath)
            acct.link<&MatrixMarketOpenOffer.OpenOffer{MatrixMarketOpenOffer.OpenOfferPublic}>(MatrixMarketOpenOffer.OpenOfferPublicPath, target: MatrixMarketOpenOffer.OpenOfferStoragePath)
        }
    }
}`;
