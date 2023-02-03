import { CanvasCache } from '../../../src/services/canvasCache'

describe('canvasCache', () => {
  it('should store last image', () => {
    const cache = new CanvasCache('last')

    const result = cache.getCanvas()

    expect(result).toStrictEqual({
      checkpoint: 0,
      canvas: 'last',
    })
  })

  it('should return last added item', () => {
    const cache = new CanvasCache('first')

    cache.add('second')
    const result = cache.getCanvas()

    expect(result).toStrictEqual({
      checkpoint: 1,
      canvas: 'second',
    })
  })
})
