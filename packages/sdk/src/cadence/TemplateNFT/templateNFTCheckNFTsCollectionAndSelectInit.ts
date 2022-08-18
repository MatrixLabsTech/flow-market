
// language=Cadence
export const templateNFTCheckNFTsCollectionAndSelectInit: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import _NFT_NAME_ from _NFT_ADDRESS_

pub fun main(addr: Address): UInt64 {
    let ref = getAccount(addr).getCapability<&{NonFungibleToken.CollectionPublic}>(_COLLECTION_PUBLIC_PATH_).check()
    if(ref){
        return 0
    }
    let collection = getAccount(address)
        .getCapability<&{NonFungibleToken.CollectionPublic}>(_NFT_NAME_.CollectionPublicPath).check()
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>()
}`;
