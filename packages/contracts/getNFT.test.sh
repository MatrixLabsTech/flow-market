cp -f cadence/scripts/templateNFT/getNFT.cdc cadence/scripts/templateNFT/__getNFT.cdc
sed -i '' 's/0xNON_FUNGIBLE_TOKEN_ADDRESS/0x1d7e57aa55817448/g' cadence/scripts/templateNFT/__getNFT.cdc
sed -i '' 's/_NFT_NAME_/Hexi_Coll_1108/g' cadence/scripts/templateNFT/__getNFT.cdc
sed -i '' 's/_NFT_ADDRESS_/0x8c8989db8aa4fbf4/g' cadence/scripts/templateNFT/__getNFT.cdc
flow --network=mainnet scripts execute cadence/scripts/templateNFT/__getNFT.cdc 0x8c8989db8aa4fbf4 0
