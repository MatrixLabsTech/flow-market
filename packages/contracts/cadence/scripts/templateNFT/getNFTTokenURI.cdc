import __NFT_NAME__ from __NFT_ADDRESS__

pub fun main(id: UInt64): String {
    return __NFT_NAME__.getTokenURI(id: id)
}
