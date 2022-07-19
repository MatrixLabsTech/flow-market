import * as fcl from "@onflow/fcl";

// language=Cadence
export const templateNFTInitNFTCollection: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS
import MetadataViews from 0xMETADATA_VIEWS_ADDRESS

import _NFT_NAME_ from _NFT_ADDRESS_


// Setup storage for _NFT_NAME_ on signer account
transaction {
    prepare(acct: AuthAccount) {
        acct.link<&FungibleToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>
             (/public/flowTokenReceiver, target: /storage/flowTokenVault)
        if acct.borrow<&_NFT_NAME_.Collection>(from: _COLLECTION_STORAGE_PATH_) == nil {
            let collection <- _NFT_NAME_.createEmptyCollection() as! @_NFT_NAME_.Collection
            acct.save(<-collection, to: _COLLECTION_STORAGE_PATH_)
            acct.link<&{_NFT_NAME_._NFT_NAME_CollectionPublic, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(_COLLECTION_PUBLIC_PATH_, target: _COLLECTION_STORAGE_PATH_)
        }
    }
}`;
