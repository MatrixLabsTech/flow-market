import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MetadataViews from 0xMETADATA_VIEWS_ADDRESS

import _NFT_NAME_ from _NFT_ADDRESS_

pub fun main(address: Address, id: UInt64): {Type:AnyStruct?}? {
        let owner = getAccount(address)
        let col= owner
            .getCapability(_NFT_NAME_.CollectionPublicPath)
            .borrow<&{MetadataViews.ResolverCollection}>()
            ?? panic("NFT Collection not found")
        if col == nil { return nil }

        let nft = col!.borrowViewResolver(id: id)

        if nft == nil { return nil }

        let views = nft!.getViews()
        let ret:{Type:AnyStruct?} = {}
        for view in views{
            ret[view] = nft!.resolveView(view)
        }
        return ret
}
