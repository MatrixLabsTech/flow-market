## Deploy Project to Emulator

Start local emulator

`flow emulator`

Deploy all project

`bash ./sh/deploy-to-local-emulator.sh`

## Deploy to mainnet

`bash ./sh/deploy-to-main.sh`

## Mainnet deployment
MatrixMarket (on hold)
MatrixMarketOpenOffer (0x2162bbe13ade251e)[https://flow-view-source.com/mainnet/account/0x2162bbe13ade251e/contract/MatrixMarketOpenOffer]

## Mainnet update after 2022-07-21 audit
`flow accounts update-contract MatrixMarketOpenOffer ./cadence/contracts/MatrixMarketOpenOffer.cdc --signer main -n mainnet`
