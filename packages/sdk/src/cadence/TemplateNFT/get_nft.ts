import * as fcl from "@onflow/fcl";

// language=Cadence
export const templateNFTGetNFTScript: string = `
import NonFungibleToken from 0xNON_FUNGIBLE_TOKEN_ADDRESS
import __NFT_NAME__ from __NFT_ADDRESS__

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
            name: "__NFT_NAME__",
            address: __NFT_ADDRESS__,
            storage_path: "__NFT_NAME__.CollectionStoragePath",
            public_path: "__NFT_NAME__.CollectionPublicPath",
            public_collection_name: "NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, __NFT_NAME__.__NFT_NAME__CollectionPublic", // interfaces required for initialization
            external_domain: "https://matrixworld.org",
        )
        let owner = getAccount(address)
        let col= owner
            .getCapability(__COLLECTION_PUBLIC_PATH__)
            .borrow<&{__NFT_NAME__.__NFT_NAME__CollectionPublic, NonFungibleToken.CollectionPublic}>()
            ?? panic("NFT Collection not found")
        if col == nil { return nil }

        let nft = col!.borrow__NFT_NAME__(id: id)
        if nft == nil { return nil }

        let metadata = nft!.getRawMetadata()
        let rawMetadata: {String:String?} = {}
        for key in metadata.keys {
            rawMetadata.insert(key: key, metadata[key])
        }
        let media: [NFTMedia] = []
        if(metadata["displayUrl"] != nil && metadata["displayUrlMediaType"] != nil){
            media.append(NFTMedia(uri: metadata["displayUrl"], mimetype: metadata["displayUrlMediaType"]))
            if(metadata["contentUrl"] != nil && metadata["contentUrlMediaType"] != nil){
                media.append(NFTMedia(uri: metadata["contentUrl"], mimetype: metadata["contentUrlMediaType"]))
            }
        }else if(metadata["imageUrl"] != nil){
            media.append(NFTMedia(uri:metadata["imageUrl"], mimetype: "image"))
        }else if(metadata["image"] != nil){
            media.append(NFTMedia(uri:metadata["image"], mimetype: "image"))
        }

        return NFTData(
            contract: contract,
            id: id,
            uuid: nft!.uuid,
            title: metadata["name"],
            description: metadata["description"],
            external_domain_view_url: "https://matrixworld.org/profile",
            token_uri: metadata["token_uri"],
            media: media,
            metadata: rawMetadata
        )
}`;
