import _NFT_NAME_ from _NFT_ADDRESS_

pub fun main(id: UInt64): String {
    return _NFT_NAME_.getTokenURI(id: id)
}
