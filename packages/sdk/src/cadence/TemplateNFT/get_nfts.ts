import * as fcl from "@onflow/fcl";

// language=Cadence
export const templateNFTGetNFTsScript: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import __NFT_NAME__ from __NFT_ADDRESS__
pub fun main(address: Address): [UInt64]{
    let collection = getAccount(address)
        .getCapability(__COLLECTION_PUBLIC_PATH__)
        .borrow<&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}>() ?? panic("NFT Collection not found")
    let ids = collection.getIDs()

    return ids
}`;
