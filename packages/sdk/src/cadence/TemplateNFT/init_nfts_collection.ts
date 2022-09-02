import * as fcl from "@onflow/fcl";

// language=Cadence
export const templateNFTInitNFTCollection: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS
import MetadataViews from 0xMETADATA_VIEWS_ADDRESS

import __NFT_NAME__ from __NFT_ADDRESS__


// Setup storage for __NFT_NAME__ on signer account
transaction {
    prepare(acct: AuthAccount) {
        acct.link<&FungibleToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>
             (/public/flowTokenReceiver, target: /storage/flowTokenVault)
        if acct.borrow<&__NFT_NAME__.Collection>(from: __COLLECTION_STORAGE_PATH__) == nil {
            let collection <- __NFT_NAME__.createEmptyCollection() as! @__NFT_NAME__.Collection
            acct.save(<-collection, to: __COLLECTION_STORAGE_PATH__)
            acct.link<&{NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic __COLLECTION_LINKS__}>(__COLLECTION_PUBLIC_PATH__, target: __COLLECTION_STORAGE_PATH__)
        }
    }
}`;
