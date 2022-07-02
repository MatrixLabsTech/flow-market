import NonFungibleToken from 0x1d7e57aa55817448
import MetadataViews from 0x1d7e57aa55817448
import MatrixMarket from 0x2162bbe13ade251e

transaction {
  prepare(acct: AuthAccount) {
    if acct.getCapability<&{NonFungibleToken.Provider}>(MatrixMarket.CollectionPublicPath).check() == true {
        log("detected")
        acct.unlink(MatrixMarket.CollectionPublicPath)
        log("unlink")
        acct.link<&{NonFungibleToken.CollectionPublic, MatrixMarket.MatrixMarketCollectionPublic, MetadataViews.ResolverCollection}>(
                    MatrixMarket.CollectionPublicPath,
                    target: MatrixMarket.CollectionStoragePath
                )
        log("linked")
    }
  }
}
