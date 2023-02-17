import { sha256 } from '../../../src/utils'

describe('sha256', () => {
  it('should convert the number into a uint256', () => {
    const buffer = Buffer.from('wittypixels')

    const hash = sha256(buffer)

    expect(hash).toBe(
      'c3a3ee99e9fb7ac257541c20d5a98740b207975b4c70d4261eb60f36aa8eab14'
    )
  })
})
