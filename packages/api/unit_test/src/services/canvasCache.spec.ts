import { CanvasCache } from '../../../src/services/canvasCache'

describe('canvasCache', () => {
  it('should store last image', () => {
    const cache = new CanvasCache('last', 0)

    const result = cache.getCanvas()

    expect(result).toStrictEqual({
      checkpoint: 0,
      canvas: 'last',
    })
  })

  it('should return last added item', () => {
    const cache = new CanvasCache('first', 0)

    cache.add('second')
    const result = cache.getCanvas()

    expect(result).toStrictEqual({
      checkpoint: 1,
      canvas: 'second',
    })
  })

  it('should work when checkpoint passed is !== 0', () => {
    const cache = new CanvasCache('first', 5)

    cache.add('second')
    const result = cache.getCanvas()

    expect(result).toStrictEqual({
      checkpoint: 6,
      canvas: 'second',
    })
  })
})
