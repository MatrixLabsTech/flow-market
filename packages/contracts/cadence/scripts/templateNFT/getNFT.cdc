import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import _NFT_NAME_ from _NFT_ADDRESS_

pub struct NFTData {
    pub let contract: NFTContractData
    pub let id: UInt64
    pub let uuid: UInt64?
    pub let title: String?
    pub let description: String?
    pub let external_domain_view_url: String?
    pub let token_uri: String?
    pub let media: [NFTMedia?]
    pub let metadata: {String: String?}

    init(
        contract: NFTContractData,
        id: UInt64,
        uuid: UInt64?,
        title: String?,
        description: String?,
        external_domain_view_url: String?,
        token_uri: String?,
        media: [NFTMedia?],
        metadata: {String: String?}
    ) {
        self.contract = contract
        self.id = id
        self.uuid = uuid
        self.title = title
        self.description = description
        self.external_domain_view_url = external_domain_view_url
        self.token_uri = token_uri
        self.media = media
        self.metadata = metadata
    }
}

pub struct NFTContractData {
    pub let name: String
    pub let address: Address
    pub let storage_path: String
    pub let public_path: String
    pub let public_collection_name: String
    pub let external_domain: String

    init(
        name: String,
        address: Address,
        storage_path: String,
        public_path: String,
        public_collection_name: String,
        external_domain: String
    ) {
        self.name = name
        self.address = address
        self.storage_path = storage_path
        self.public_path = public_path
        self.public_collection_name = public_collection_name
        self.external_domain = external_domain
    }
}

pub struct NFTMedia {
    pub let uri: String?
    pub let mimetype: String?

    init(
        uri: String?,
        mimetype: String?
    ) {
        self.uri = uri
        self.mimetype = mimetype
    }
}

pub fun main(address: Address, id: UInt64): NFTData? {
    let contract = NFTContractData(
            name: "_NFT_NAME_",
            address: 0x7f3812b53dd4de20,
            storage_path: "_NFT_NAME_.CollectionStoragePath",
            public_path: "_NFT_NAME_.CollectionPublicPath",
            public_collection_name: "NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, _NFT_NAME_._NFT_NAME_CollectionPublic", // interfaces required for initialization
            external_domain: "https://matrixworld.org",
        )

        let col= owner
            .getCapability(_NFT_NAME_.CollectionPublicPath)
            .borrow<&{_NFT_NAME_._NFT_NAME_CollectionPublic, NonFungibleToken.CollectionPublic}>()
            ?? panic("NFT Collection not found")
        if col == nil { return nil }

        let nft = col!.borrow_NFT_NAME_(id: id)
        if nft == nil { return nil }

        let metadata = nft!.getRawMetadata()
        let rawMetadata: {String:String?} = {}
        for key in metadata.keys {
            rawMetadata.insert(key: key, metadata[key])
        }

        return NFTData(
            contract: contract,
            id: id,
            uuid: nft!.uuid,
            title: metadata["name"],
            description: metadata["description"],
            external_domain_view_url: "https://matrixworld.org/profile",
            token_uri: nil,
            media: [
                NFTMedia(uri: metadata["displayUrl"], mimetype: metadata["displayUrlMediaType"]),
                NFTMedia(uri: metadata["contentUrl"], mimetype: metadata["contentUrlMediaType"])
            ],
            metadata: rawMetadata
        )
}
