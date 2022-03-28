import FungibleToken from "../contracts/FungibleToken.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import MatrixMarketplaceOpenBid from "../contracts/MatrixMarketplaceOpenBid.cdc"
import FlowToken from "../contracts/FlowToken.cdc"
import ExampleNFT from "../contracts/ExampleNFT.cdc"

transaction(nftId: UInt64, amount: UFix64) {
    let nftReceiver: Capability<&{NonFungibleToken.CollectionPublic}>
    let vaultRef: Capability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>
    let openBid: &MatrixMarketplaceOpenBid.OpenBid

    prepare(account: AuthAccount) {
        let vaultRefPrivatePath = /private/FlowTokenVaultRefForMatrixMarketplaceOpenBid

        self.nftReceiver = account.getCapability<&{NonFungibleToken.CollectionPublic}>(/public/NFTCollection)!
        assert(self.nftReceiver.check(), message: "Missing or mis-typed ExampleNFT receiver")

        if !account.getCapability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath)!.check() {
            account.link<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath, target: /storage/flowTokenVault)
        }

        self.vaultRef = account.getCapability<&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}>(vaultRefPrivatePath)!
        assert(self.vaultRef.check(), message: "Missing or mis-typed fungible token vault ref")

        self.openBid = account.borrow<&MatrixMarketplaceOpenBid.OpenBid>(from: MatrixMarketplaceOpenBid.OpenBidStoragePath)
            ?? panic("Missing or mis-typed MatrixMarketplaceOpenBid OpenBid")
    }

    execute {
        let cut = MatrixMarketplaceOpenBid.Cut(
            receiver: getAccount(0x00).getCapability<&{FungibleToken.Receiver}>(/public/NFTCollection),
            amount: amount
        )
        self.openBid.createBid(
            vaultRefCapability: self.vaultRef,
            offerPrice: amount,
            rewardCapability: self.nftReceiver,
            nftType: Type<@ExampleNFT.NFT>(),
            nftId: nftId,
            cuts: []
        )
    }
}
