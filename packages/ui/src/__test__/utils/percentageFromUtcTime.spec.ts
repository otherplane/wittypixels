import { percentageFromUtcTime } from '@/utils'
import { describe, expect, it } from 'vitest'

describe('percentageFromUtcTime', () => {
  it('Current time is in the middle', () => {
    const currentTime = new Date().getTime()
    const prevTime = currentTime - 5000
    const nextTime = currentTime + 5000
    const percentage = percentageFromUtcTime(prevTime, currentTime, nextTime)
    expect(expect(percentage).toBe(50))
  })
  it('Current time is at the beggining', () => {
    const currentTime = new Date().getTime()
    const prevTime = currentTime - 0
    const nextTime = currentTime + 5000
    const percentage = percentageFromUtcTime(prevTime, currentTime, nextTime)
    expect(expect(percentage).toBe(0))
  })
  it('Current time is at the end', () => {
    const currentTime = new Date().getTime()
    const prevTime = currentTime - 5000
    const nextTime = currentTime
    const percentage = percentageFromUtcTime(prevTime, currentTime, nextTime)
    expect(expect(percentage).toBe(100))
  })
  it('Current time is minus 1 millisecond', () => {
    const currentTime = new Date().getTime()
    const prevTime = currentTime - 1
    const nextTime = currentTime + 5000
    const percentage = percentageFromUtcTime(prevTime, currentTime, nextTime)
    expect(expect(percentage).toBe(0.019996000799835656))
  })
  it('Prev time is currentTime', () => {
    const currentTime = new Date().getTime()
    const prevTime = currentTime
    const nextTime = currentTime + 5000
    const percentage = percentageFromUtcTime(prevTime, currentTime, nextTime)
    expect(expect(percentage).toBe(0))
  })
  it('Prev time is 0', () => {
    const currentTime = new Date().getTime()
    const prevTime = 0
    const nextTime = currentTime + 5000
    const percentage = percentageFromUtcTime(prevTime, currentTime, nextTime)
    expect(expect(percentage.toFixed()).toBe('100'))
  })
  it('Next time is 0', () => {
    const currentTime = new Date().getTime()
    const prevTime = currentTime - 1
    const nextTime = 0
    const percentage = percentageFromUtcTime(prevTime, currentTime, nextTime)
    expect(expect(percentage.toFixed()).toBe('100'))
  })
  it('Prev and next time is 0', () => {
    const currentTime = new Date().getTime()
    const prevTime = 0
    const nextTime = 0
    const percentage = percentageFromUtcTime(prevTime, currentTime, nextTime)
    expect(expect(percentage).toBe(100))
  })
})
