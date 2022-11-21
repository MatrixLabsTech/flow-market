import * as fcl from "@onflow/fcl";

// language=Cadence
export const checkNeedRepair: string = `
import FungibleToken from 0xFUNGIBLE_TOKEN_ADDRESS
import FUSD from 0xFUSD_ADDRESS
import FlowToken from 0xFLOW_TOKEN_ADDRESS

pub fun main(addr: Address): Bool {
    var needRepair = false
    
    needRepair = getAccount(addr).getCapability<&FlowToken.Vault>(/public/flowTokenReceiver).check()
    if(needRepair){return true}
    
    needRepair = getAccount(addr).getCapability<&FUSD.Vault>(/public/fusdReceiver).check()
    if(needRepair){return true}
    
    return needRepair
}`;
