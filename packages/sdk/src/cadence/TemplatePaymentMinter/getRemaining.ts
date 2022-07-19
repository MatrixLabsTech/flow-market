// language=Cadence
export const getRemaining = `
import _PAYMENT_MINTER_NAME_ from _PAYMENT_MINTER_ADDRESS_

pub fun main(): UInt64 {
    if(_PAYMENT_MINTER_NAME_.sale == nil){
      return 0
    }
    return _PAYMENT_MINTER_NAME_.sale!.max-_PAYMENT_MINTER_NAME_.sale!.current
}`;
