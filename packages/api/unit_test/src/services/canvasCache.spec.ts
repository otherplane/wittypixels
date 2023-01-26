import { Draw } from '../../../src/domain/draw'
import { CanvasCache } from '../../../src/services/canvasCache'

function drawFactory(player: string): Draw {
  return new Draw({
    color: 0,
    ends: 0,
    player: player,
    timestamp: 0,
    x: 0,
    y: 0,
  })
}

describe('canvasCache', () => {
  it('should return all elements added', () => {
    const cache = new CanvasCache(4)

    const draw1 = drawFactory('1')
    const draw2 = drawFactory('2')
    const draw3 = drawFactory('3')

    cache.add(draw1)
    cache.add(draw2)
    cache.add(draw3)

    expect(cache.getFrom(0)).toStrictEqual([draw1, draw2, draw3])
  })

  it('should store the max limit given', () => {
    const cache = new CanvasCache(3)

    const draw1 = drawFactory('1')
    const draw2 = drawFactory('2')
    const draw3 = drawFactory('3')
    const draw4 = drawFactory('4')

    cache.add(draw1)
    cache.add(draw2)
    cache.add(draw3)
    cache.add(draw4)

    expect(cache.getFrom(1)).toStrictEqual([draw2, draw3, draw4])
  })

  it('should return error if checkpoint is smaller than the items stored in the cache', () => {
    const cache = new CanvasCache(3)

    const draw1 = drawFactory('1')
    const draw2 = drawFactory('2')
    const draw3 = drawFactory('3')
    const draw4 = drawFactory('4')

    cache.add(draw1)
    cache.add(draw2)
    cache.add(draw3)
    cache.add(draw4)

    const f = () => cache.getFrom(0)

    expect(f).toThrow(Error)
  })

  it('should return error if checkpoint is greater than the items stored in the cache', () => {
    const cache = new CanvasCache(3)

    const draw1 = drawFactory('1')
    const draw2 = drawFactory('2')
    const draw3 = drawFactory('3')
    const draw4 = drawFactory('4')

    cache.add(draw1)
    cache.add(draw2)
    cache.add(draw3)
    cache.add(draw4)

    const f = () => cache.getFrom(10)

    expect(f).toThrow(Error)
  })

  it('should return error if checkpoint is greater than the number of items stored', () => {
    const cache = new CanvasCache(10)

    const draw1 = drawFactory('1')
    const draw2 = drawFactory('2')
    const draw3 = drawFactory('3')
    const draw4 = drawFactory('4')

    cache.add(draw1)
    cache.add(draw2)
    cache.add(draw3)
    cache.add(draw4)

    const f = () => cache.getFrom(7)

    expect(f).toThrow(Error)
  })

  it('should return empty array if checkpoint equals last index', () => {
    const cache = new CanvasCache(3)

    const draw1 = drawFactory('1')
    const draw2 = drawFactory('2')
    const draw3 = drawFactory('3')
    const draw4 = drawFactory('4')
    const draw5 = drawFactory('5')
    const draw6 = drawFactory('6')
    const draw7 = drawFactory('7')

    cache.add(draw1)
    cache.add(draw2)
    cache.add(draw3)
    cache.add(draw4)
    cache.add(draw5)
    cache.add(draw6)
    cache.add(draw7)

    const result = cache.getFrom(7)

    expect(result).toStrictEqual([])
  })

  it('should move internal window', () => {
    const cache = new CanvasCache(3)

    const draw1 = drawFactory('1')
    const draw2 = drawFactory('2')
    const draw3 = drawFactory('3')
    const draw4 = drawFactory('4')
    const draw5 = drawFactory('5')
    const draw6 = drawFactory('6')
    const draw7 = drawFactory('7')

    cache.add(draw1)
    cache.add(draw2)
    cache.add(draw3)
    cache.add(draw4)
    cache.add(draw5)
    cache.add(draw6)
    cache.add(draw7)

    const result = cache.getFrom(6)

    expect(result).toStrictEqual([draw7])
  })

  it('should set internal indexes when calling load with loaded items lenght equals the max cache size', () => {
    const cache = new CanvasCache(3)

    const draw1 = drawFactory('1')
    const draw2 = drawFactory('2')
    const draw3 = drawFactory('3')
    const draw4 = drawFactory('4')
    const draw5 = drawFactory('5')
    const draw6 = drawFactory('6')
    const draw7 = drawFactory('7')

    cache.add(draw1)
    cache.add(draw2)
    cache.add(draw3)
    cache.add(draw4)
    cache.add(draw5)
    cache.add(draw6)
    cache.add(draw7)
    const loadedCache = new CanvasCache(3)

    loadedCache.load([draw5, draw6, draw7], cache.lastIndex)

    expect(cache.firstIndex).toBe(loadedCache.firstIndex)
    expect(cache.lastIndex).toBe(loadedCache.lastIndex)
  })

  it('should set internal indexes when loading a cache size which is smaller than max size', () => {
    const cache = new CanvasCache(10)

    const draw1 = drawFactory('1')
    const draw2 = drawFactory('2')
    const draw3 = drawFactory('3')
    const draw4 = drawFactory('4')
    const draw5 = drawFactory('5')
    const draw6 = drawFactory('6')
    const draw7 = drawFactory('7')

    cache.add(draw1)
    cache.add(draw2)
    cache.add(draw3)
    cache.add(draw4)
    cache.add(draw5)
    cache.add(draw6)
    cache.add(draw7)

    const loadedCache = new CanvasCache(10)

    loadedCache.load(
      [draw1, draw2, draw3, draw4, draw5, draw6, draw7],
      cache.lastIndex
    )

    expect(cache.firstIndex).toBe(loadedCache.firstIndex)
    expect(cache.lastIndex).toBe(loadedCache.lastIndex)
  })
})
