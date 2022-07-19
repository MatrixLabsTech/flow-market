
// language=Cadence
export const templateNFTCheckNFTsCollection: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import _NFT_NAME_ from _NFT_ADDRESS_

pub fun main(addr: Address): Bool {
    let ref = getAccount(addr).getCapability<&{NonFungibleToken.CollectionPublic}>(_COLLECTION_PUBLIC_PATH_).check()
    return ref
}`;
