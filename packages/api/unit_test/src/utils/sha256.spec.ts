import { sha256 } from '../../../src/utils'

describe('sha256', () => {
  it('should convert the number into a uint256', () => {
    const buffer = Buffer.from('wittypixels')

    const hash = sha256(buffer)

    expect(hash).toBe('w6Pumen7esJXVBwg1amHQLIHl1tMcNQmHrYPNqqOqxQ=')
  })
})
