
// language=Cadence
export const templateNFTCheckNFTsCollectionAndSelectInit: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import __NFT_NAME__ from __NFT_ADDRESS__

pub fun main(addr: Address): UInt64 {
    let ref = getAccount(addr).getCapability<&{NonFungibleToken.CollectionPublic}>(__COLLECTION_PUBLIC_PATH__).check()
    if(ref){
        return 0
    }
    let collection = getAccount(address)
        .getCapability<&{NonFungibleToken.CollectionPublic}>(__NFT_NAME__.CollectionPublicPath).check()
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>()
}`;
