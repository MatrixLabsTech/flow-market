import * as fcl from "@onflow/fcl";

// language=Cadence
export const repair: string = `
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FUSD from 0xFUSD_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS

transaction {
    prepare(acct: AuthAccount) {
        acct.unlink(/public/flowTokenReceiver)
        acct.link<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver, target: /storage/flowTokenVault)
        
        acct.unlink(/public/fusdReceiver)
        acct.link<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver, target: /storage/fusdVault)
    }
}`;
