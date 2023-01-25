import { CANVAS_CACHE_SIZE } from './constants'
import { Draw } from './domain/draw'

export class CanvasCache {
  // Store all draws in a map where the key is the order in which they were created
  drawCache: Record<number, Draw>
  firstIndex: number
  lastIndex: number

  constructor() {
    this.drawCache = {}
    this.firstIndex = 0
    this.lastIndex = 0
  }

  public add(draw: Draw) {
    this.drawCache[this.lastIndex] = draw
    this.lastIndex += 1
    if (this.lastIndex - this.firstIndex > CANVAS_CACHE_SIZE) {
      delete this.drawCache[this.firstIndex]
      this.firstIndex += 1
    }
  }

  getFrom(checkpoint: number) {
    if (checkpoint < this.firstIndex) {
      new Error("Checkpoint can't be smaller than first items stored")
    }

    const draws = []
    for (let i = checkpoint; checkpoint < this.lastIndex; i += 1) {
      const previousDraw = this.drawCache[i]
      draws.push(previousDraw)
    }

    // TODO: Implement this logic in the frontend to be mor efficient
    // const drawsMap = draws.reduce((acc: Record<string, Draw>, draw) => {
    //   const key = `${draw.x}${draw.y}`
    //   acc[key] = draw
    //   return acc
    // }, {} as Record<string, Draw>)

    return draws
  }
}
