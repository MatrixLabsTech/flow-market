import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import _NFT_NAME_ from _NFT_ADDRESS_
pub fun main(address: Address): [UInt64]{
    let col = getAccount(address)
        .getCapability(_NFT_NAME_.CollectionPublicPath)
        .borrow<&{_NFT_NAME_._NFT_NAME_CollectionPublic, NonFungibleToken.CollectionPublic}>()
        ?? panic("NFT Collection not found")

    return col!.getIDs()
}
