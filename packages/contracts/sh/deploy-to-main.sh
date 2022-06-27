#!/bin/bash
flow accounts add-contract MatrixMarket ./cadence/contracts/MatrixMarket.cdc -f flow.json -f flow.mainnet.json -n mainnet --signer main
flow accounts add-contract MatrixMarketOpenOffer ./cadence/contracts/MatrixMarketOpenOffer.cdc -f flow.json -f flow.mainnet.json -n mainnet --signer main
