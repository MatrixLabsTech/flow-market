import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import __NFT_NAME__ from __NFT_ADDRESS__
pub fun main(address: Address): [UInt64]{
    let col = getAccount(address)
        .getCapability(__NFT_NAME__.CollectionPublicPath)
        .borrow<&{__NFT_NAME__._NFT_NAME_CollectionPublic, NonFungibleToken.CollectionPublic}>()
        ?? panic("NFT Collection not found")

    return col!.getIDs()
}
