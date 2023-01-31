import { Draw } from '../../../src/domain/draw'
import { CANVAS_SECTOR_SIZE } from '../../../src/constants'

describe('draw.ts', () => {
  it('should return the correct object calling toDbVTO', async () => {
    const canvas = new Draw({
      color: 0,
      ends: 1675178197787,
      owner: 'abcde',
      timestamp: 1675178195287,
      x: 70,
      y: 70,
    })

    expect(canvas.toDbVTO()).toStrictEqual({
      color: 0,
      ends: 1675178197787,
      owner: 'abcde',
      timestamp: 1675178195287,
      x: 70,
      y: 70,
    })
  })

  it('should return the correct object calling toVTO', async () => {
    const canvas = new Draw({
      color: 0,
      ends: 1675178197787,
      owner: 'abcde',
      timestamp: 1675178195287,
      x: 70,
      y: 70,
    })

    expect(canvas.toVTO()).toStrictEqual({
      c: 0,
      o: 'abcde',
      t: 1675178195287,
      x: 70,
      y: 70,
    })
  })

  it('should calculate the database sector toDbSectorInfo with when pixel is smaller than cache size', async () => {
    const canvas = new Draw({
      color: 0,
      ends: 1675178197787,
      owner: 'abcde',
      timestamp: 1675178195287,
      x: 0,
      y: 0,
    })

    expect(canvas.toDbSectorInfo()).toStrictEqual({ sector: '0-0', x: 0, y: 0 })
  })

  it('should calculate the database sector toDbSectorInfo with when pixel is bigger than cache size', async () => {
    const canvas = new Draw({
      color: 0,
      ends: 1675178197787,
      owner: 'abcde',
      timestamp: 1675178195287,
      x: CANVAS_SECTOR_SIZE + 1,
      y: CANVAS_SECTOR_SIZE + 1,
    })

    expect(canvas.toDbSectorInfo()).toStrictEqual({ sector: '1-1', x: 1, y: 1 })
  })
})
