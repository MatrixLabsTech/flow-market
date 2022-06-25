import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import _NFT_NAME_ from _NFT_ADDRESS_
pub fun main(address: Address, id: UInt64): {String: String}{
    let col = getAccount(address)
        .getCapability(_NFT_NAME_.CollectionPublicPath)
        .borrow<&{_NFT_NAME_._NFT_NAME_CollectionPublic, NonFungibleToken.CollectionPublic}>()
        ?? panic("NFT Collection not found")

    return col!.borrow_NFT_NAME_(id: id)!.getRawMetadata()
}
