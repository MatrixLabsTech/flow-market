// language=Cadence
export const getPrice = `
import _PAYMENT_MINTER_NAME_ from _PAYMENT_MINTER_ADDRESS_

pub fun main(): UFix64 {
    if(_PAYMENT_MINTER_NAME_.sale == nil){
      return 0
    }
    return _PAYMENT_MINTER_NAME_.sale!.price
}`;
