import { msToSeconds } from '../../../src/utils/msToSeconds'

describe('toUint256', () => {
  it('should convert from ms to seconds', () => {
    const ms = 1676543275000

    const seconds = msToSeconds(ms)

    expect(seconds).toBe(1676543275)
  })

  it('should ignore decimal part', () => {
    const ms = 1676543275304

    const seconds = msToSeconds(ms)

    expect(seconds).toBe(1676543275)
  })
})
