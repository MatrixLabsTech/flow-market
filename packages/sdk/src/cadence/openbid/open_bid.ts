import * as fcl from "@onflow/fcl";

export const openBid: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS
import MatrixMarketOpenBid from 0xOPENBID_ADDRESS
import FUSD from 0xFUSD_ADDRESS

import 0xsupportedNFTName from 0xsupportedNFTAddress

transaction(nftId: UInt64, amount: UFix64, paymentToken: String, royaltyReceivers: [Address], royaltyAmount: [UFix64], expirationTime: UFix64) {
    let nftReceiver: Capability<&{NonFungibleToken.CollectionPublic}>
    let vaultRef: Capability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>
    let openBid: &MatrixMarketOpenBid.OpenBid
    let saleCuts: [MatrixMarketOpenBid.Cut]
    
    prepare(acct: AuthAccount) {
        var tokenStoragePath = /storage/flowTokenVault
        var tokenPublicPath = /public/flowTokenReceiver
        var vaultRefPrivatePath = /private/flowTokenVaultRefForMatrixMarketOpenBid
        if(paymentToken == "FLOW"){
        }else if(paymentToken == "FUSD"){
            tokenStoragePath = /storage/fusdVault
            tokenPublicPath = /public/fusdReceiver

            vaultRefPrivatePath = /private/fusdVaultRefForMatrixMarketOpenBid
        }else{
            panic("unsupported paymentToken")
        }
        
        self.nftReceiver = acct.getCapability<&{NonFungibleToken.CollectionPublic}>(0xsupportedNFTName.CollectionPublicPath)!
        assert(self.nftReceiver.check(), message: "Missing or mis-typed 0xsupportedNFTName receiver")

        if !acct.getCapability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath)!.check() {
            acct.link<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath, target: tokenStoragePath)
        }

        self.vaultRef = acct.getCapability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath)!
        assert(self.vaultRef.check(), message: "Missing or mis-typed fungible token vault ref")

        self.openBid = acct.borrow<&MatrixMarketOpenBid.OpenBid>(from: MatrixMarketOpenBid.OpenBidStoragePath)
            ?? panic("Missing or mis-typed MatrixMarketOpenBid OpenBid")
            
        let size = royaltyReceivers.length
        if (size != royaltyAmount.length) {
            panic ("royaltyReceivers, royaltyAmount length not equal")
        }
        self.saleCuts = []
        var i = 0
        while i < size {
            self.saleCuts.append(MatrixMarketOpenBid.Cut(
                receiver: getAccount(royaltyReceivers[i]).getCapability<&{FungibleToken.Receiver}>(tokenPublicPath)!,
                amount:  royaltyAmount[i]
            ))
            i = i + 1
        }
    }

    execute {
       
        self.openBid.createBid(
            vaultRefCapability: self.vaultRef,
            offerPrice: amount,
            rewardCapability: self.nftReceiver,
            nftType: Type<@0xsupportedNFTName.NFT>(),
            nftId: nftId,
            cuts: self.saleCuts,
            expirationTime: expirationTime
        )
    }
}`;
