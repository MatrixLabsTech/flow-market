import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MetadataViews from 0xMETADATA_VIEWS_ADDRESS
import _NFT_NAME_ from _NFT_ADDRESS_
pub struct NFTCollectionDataPatched {
        /// Path in storage where this NFT is recommended to be stored.
        pub let storagePath: StoragePath

        /// Public path which must be linked to expose public capabilities of this NFT
        /// including standard NFT interfaces and metadataviews interfaces
        pub let publicPath: PublicPath

        /// Private path which should be linked to expose the provider
        /// capability to withdraw NFTs from the collection holding NFTs
        pub let providerPath: PrivatePath

        /// Public collection type that is expected to provide sufficient read-only access to standard
        /// functions (deposit + getIDs + borrowNFT)
        /// This field is for backwards compatibility with collections that have not used the standard
        /// NonFungibleToken.CollectionPublic interface when setting up collections. For new
        /// collections, this may be set to be equal to the type specified in `publicLinkedType`.
        pub let publicCollection: Type

        /// Type that should be linked at the aforementioned public path. This is normally a
        /// restricted type with many interfaces. Notably the `NFT.CollectionPublic`,
        /// `NFT.Receiver`, and `MetadataViews.ResolverCollection` interfaces are required.
        pub let publicLinkedType: Type

        /// Type that should be linked at the aforementioned private path. This is normally
        /// a restricted type with at a minimum the `NFT.Provider` interface
        pub let providerLinkedType: Type

        /// Function that allows creation of an empty NFT collection that is intended to store
        /// this NFT.
        // pub let createEmptyCollection: ((): @NonFungibleToken.Collection)

        init(
            storagePath: StoragePath,
            publicPath: PublicPath,
            providerPath: PrivatePath,
            publicCollection: Type,
            publicLinkedType: Type,
            providerLinkedType: Type,
            // createEmptyCollectionFunction: ((): @NonFungibleToken.Collection)
        ) {
            self.storagePath=storagePath
            self.publicPath=publicPath
            self.providerPath = providerPath
            self.publicCollection=publicCollection
            self.publicLinkedType=publicLinkedType
            self.providerLinkedType = providerLinkedType
        }
    }
pub struct NFTViewPatched {
        pub let id: UInt64
        pub let uuid: UInt64
        pub let display: MetadataViews.Display?
        pub let externalURL: MetadataViews.ExternalURL?
        pub let collectionData: NFTCollectionDataPatched?
        pub let collectionDisplay: MetadataViews.NFTCollectionDisplay?
        pub let royalties: MetadataViews.Royalties?
        pub let traits: MetadataViews.Traits?

        init(
            id : UInt64,
            uuid : UInt64,
            display : MetadataViews.Display?,
            externalURL : MetadataViews.ExternalURL?,
            collectionData : NFTCollectionDataPatched?,
            collectionDisplay : MetadataViews.NFTCollectionDisplay?,
            royalties : MetadataViews.Royalties?,
            traits: MetadataViews.Traits?
        ) {
            self.id = id
            self.uuid = uuid
            self.display = display
            self.externalURL = externalURL
            self.collectionData = collectionData
            self.collectionDisplay = collectionDisplay
            self.royalties = royalties
            self.traits = traits
        }
    }
pub fun main(address: Address, id: UInt64): AnyStruct?{
        let owner = getAccount(address)
        let col= owner
            .getCapability(_NFT_NAME_.CollectionPublicPath)
            .borrow<&{MetadataViews.ResolverCollection}>()
            ?? panic("NFT Collection not found")
        if col == nil { return nil }
        let nft = col!.borrowViewResolver(id: id)
        if nft == nil { return nil }

        let nftView = MetadataViews.getNFTView(id: id, viewResolver: nft)
        if(nftView.collectionData != nil){
            let ret = NFTViewPatched(
                id : nftView.id,
                uuid : nftView.uuid,
                display : nftView.display,
                externalURL : nftView.externalURL,
                collectionData : NFTCollectionDataPatched(
                    storagePath: nftView.collectionData!.storagePath,
                    publicPath: nftView.collectionData!.publicPath,
                    providerPath: nftView.collectionData!.providerPath,
                    publicCollection: nftView.collectionData!.publicCollection,
                    publicLinkedType: nftView.collectionData!.publicLinkedType,
                    providerLinkedType: nftView.collectionData!.providerLinkedType
                ),
                collectionDisplay : nftView.collectionDisplay,
                royalties : nftView.royalties,
                traits: nftView.traits)
            return ret
        } else {
          return nftView
        }
}
