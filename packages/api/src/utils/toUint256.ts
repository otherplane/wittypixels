import { toHex } from 'web3-utils'

export function toUint256(x: number): string {
  const hex = toHex(x).replace('0x', '')
  console.log('hex', hex)
  const uint256 = hex.padStart(64, '0')
  console.log('uint256', uint256)

  return `0x${uint256}`
}
