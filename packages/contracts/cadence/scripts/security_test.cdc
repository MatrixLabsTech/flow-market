import NonFungibleToken from 0x1d7e57aa55817448
import MetadataViews from 0x1d7e57aa55817448
import MatrixMarket from 0x2162bbe13ade251e

pub fun main( acct: Address): Bool {
    let account = getAccount(acct)

    if account.getCapability<&{NonFungibleToken.Provider}>(MatrixMarket.CollectionPublicPath).check() == true {
        log("detected")
        return true
    }
    return false
}
