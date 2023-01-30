import { Canvas } from '../../../src/domain/canvas'
import {
  CANVAS_MAX_X,
  CANVAS_MAX_Y,
  CANVAS_SECTOR_SIZE,
  INTERACTION_DURATION_MILLIS,
} from '../../../src/constants'

describe('canvas.ts', () => {
  it('Should store internally a canvas with the correct size without arguments', async () => {
    const canvas = new Canvas()
    expect(canvas.pixels.length).toBe(CANVAS_MAX_X)
    expect(canvas.pixels[0].length).toBe(CANVAS_MAX_Y)
  })

  describe('draw', () => {
    it('should return the draw object', async () => {
      jest.spyOn(Date, 'now').mockImplementation(() => 1500000000000)

      const canvas = new Canvas()
      const now = Date.now()

      const draw = canvas.draw({
        owner: '12345',
        x: 0,
        y: 0,
        color: 1,
      })

      expect(draw.color).toBe(1)
      expect(draw.ends).toBe(now + INTERACTION_DURATION_MILLIS)
      expect(draw.owner).toBe('12345')
      expect(draw.timestamp).toBe(now)
      expect(draw.x).toBe(0)
      expect(draw.y).toBe(0)
    })

    it('should store internally the updated canvas', () => {
      const canvas = new Canvas()

      canvas.draw({
        owner: '123456',
        x: 4,
        y: 6,
        color: 2,
      })

      const pixel = canvas.pixels[4][6]
      expect(pixel.c).toBe(2)
      expect(pixel.o).toBe('123456')
      expect(pixel.x).toBe(4)
      expect(pixel.y).toBe(6)
    })
  })

  describe('toDbSectors', () => {
    it('should return all empty sectors if its not initialized', () => {
      const canvas = new Canvas()
      const dbSectors = canvas.toDbSectors()

      expect(dbSectors[0].name).toBe('0-0')
      expect(dbSectors[1].name).toBe('1-0')
      expect(
        dbSectors[Math.floor(CANVAS_MAX_X / CANVAS_SECTOR_SIZE)].name
      ).toBe('0-1')
      // Max row x === 1000
      expect(dbSectors.reverse()[0].name).toBe('19-19')
    })
  })
})
