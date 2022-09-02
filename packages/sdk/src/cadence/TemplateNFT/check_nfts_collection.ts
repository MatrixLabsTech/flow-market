
// language=Cadence
export const templateNFTCheckNFTsCollection: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import __NFT_NAME__ from __NFT_ADDRESS__

pub fun main(addr: Address): Bool {
    let ref = getAccount(addr).getCapability<&{NonFungibleToken.CollectionPublic}>(__COLLECTION_PUBLIC_PATH__).check()
    return ref
}`;
