// language=Cadence
export const MatrixMarketTemplateNFTWithTokenURI: string = `import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import MetadataViews from 0xMETADATA_VIEWS_ADDRESS

pub contract _NFT_NAME_ : NonFungibleToken {

    pub var totalSupply: UInt64

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath
    pub let AdminStoragePath: StoragePath

    //pub var CollectionPrivatePath: PrivatePath
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Mint(id: UInt64, creator: Address, metadata: {String:String})
    pub event Destroy(id: UInt64)
    
    pub var baseURI: String

    pub fun getTokenURI(id: UInt64): String {
        return self.baseURI.concat("/").concat(id.toString()) ;
    }
    
    // We use dict to store raw metadata
    pub resource interface RawMetadata {
        pub fun getRawMetadata(): {String: String}
    }

    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver, RawMetadata {
        pub let id: UInt64
        pub let creator: Address
        access(self) let metadata: {String:String}

        init(
            id: UInt64,
            creator: Address,
            metadata: {String: String}
        ) {
            self.id = id
            self.creator = creator
            self.metadata = metadata
        }

       pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>()
            ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.metadata["name"]!,
                        description: self.metadata["description"]!,
                        thumbnail: MetadataViews.HTTPFile(
                            url: self.metadata["thumbnail"]!
                        )
                    )
            }

            return nil
        }

        pub fun getRawMetadata(): {String: String} {
            return self.metadata
        }

        destroy() {
            emit Destroy(id: self.id)
        }
    }

    pub resource interface _NFT_NAME_CollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrow_NFT_NAME_(id: UInt64): &_NFT_NAME_.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow NFT reference: the ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: _NFT_NAME_CollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
        
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // deposit takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @_NFT_NAME_.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // borrowNFT gets a reference to an NFT in the collection
        // so that the caller can read its metadata and call its methods
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrow_NFT_NAME_(id: UInt64): &_NFT_NAME_.NFT? {
            if self.ownedNFTs[id] != nil {
                // Create an authorized reference to allow downcasting
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT?
                return ref as! &_NFT_NAME_.NFT?
            }

            return nil
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let mlNFT = nft as! &_NFT_NAME_.NFT
            return mlNFT
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // public function that anyone can call to create a new empty collection
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    // Resource that an admin or something similar would own to be
    // able to mint new NFTs
    //
    pub resource NFTMinter {

        // mintNFT mints a new NFT with a new ID
        // and deposit it in the recipients collection using their collection reference
        pub fun mintNFT(
            recipient: &{NonFungibleToken.CollectionPublic},
            metadata: {String: String}
        ): &NonFungibleToken.NFT {

            let creator = self.owner!.address
            // create a new NFT
            var newNFT <- create NFT(
                id: _NFT_NAME_.totalSupply,
                creator: creator,
                metadata: metadata
            )

            let tokenRef = &newNFT as &NonFungibleToken.NFT
            // deposit it in the recipient's account using their reference
            recipient.deposit(token: <-newNFT)

            _NFT_NAME_.totalSupply = _NFT_NAME_.totalSupply + 1

            emit Mint(id: tokenRef.id, creator: creator, metadata: metadata)

            return tokenRef
        }
    }
    
    pub resource Admin {
        pub fun setBaseURI(
            baseURI: String
        ){
            _NFT_NAME_.baseURI = baseURI
        }
    }

    init() {
        // Initialize the total supply
        self.totalSupply = 0

        // Set the named paths
        self.CollectionStoragePath = /storage/MatrixMarket_NFT_NAME_Collection
        self.CollectionPublicPath = /public/MatrixMarket_NFT_NAME_Collection
        self.MinterStoragePath = /storage/MatrixMarket_NFT_NAME_Minter
        self.AdminStoragePath = /storage/MatrixMarket_NFT_NAME_Admin
        
        self.baseURI = "_BASE_URI_"
        // Create a Collection resource and save it to storage
        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        // create a public capability for the collection
        self.account.link<&_NFT_NAME_.Collection{NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, _NFT_NAME_._NFT_NAME_CollectionPublic, MetadataViews.ResolverCollection}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )

        // Create a Minter resource and save it to storage
        let minter <- create NFTMinter()
        self.account.save(<-minter, to: self.MinterStoragePath)

        let admin <- create Admin()
        self.account.save(<-admin, to: self.AdminStoragePath)
        
        emit ContractInitialized()
    }
}
`
