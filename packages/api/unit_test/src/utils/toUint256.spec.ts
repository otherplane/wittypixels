import { toUint256 } from '../../../src/utils/toUint256'

describe('toUint256', () => {
  it('should convert the number into a uint256', () => {
    const n = 123456789

    const uint256 = toUint256(n)

    expect(uint256).toBe(
      '0x00000000000000000000000000000000000000000000000000000000075bcd15'
    )
  })
})
