// language=Cadence
export const getPrice = `
import __PAYMENT_MINTER_NAME__ from __PAYMENT_MINTER_ADDRESS__

pub fun main(): UFix64 {
    if(__PAYMENT_MINTER_NAME__.sale == nil){
      return 0
    }
    return __PAYMENT_MINTER_NAME__.sale!.price
}`;
