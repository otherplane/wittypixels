import { CANVAS_CACHE_MAX_SIZE } from '../constants'
import { Draw } from '../domain/draw'

export class CanvasCache {
  // Store all draws in a map where the key is the order in which they were created
  drawCache: Record<number, Draw>
  firstIndex: number
  lastIndex: number
  limit: number

  constructor(limit: number) {
    this.drawCache = {}
    this.firstIndex = 0
    this.lastIndex = 0
    this.limit = limit || CANVAS_CACHE_MAX_SIZE
  }

  public add(draw: Draw) {
    this.drawCache[this.lastIndex] = draw
    this.lastIndex += 1
    if (this.lastIndex - this.firstIndex > this.limit) {
      delete this.drawCache[this.firstIndex]
      this.firstIndex += 1
    }
  }

  getFrom(checkpoint: number) {
    if (checkpoint < this.firstIndex) {
      throw new Error("Checkpoint can't be smaller than first items stored")
    }

    if (checkpoint > this.lastIndex) {
      throw new Error("Checkpoint can't be greater than first items stored")
    }

    // const draws = new Array(this.lastIndex - checkpoint).fill(0).map((_, index) => {
    //   const previousDraw = this.drawCache[index]
    //   return previousDraw
    // })

    const draws = []
    for (let i = checkpoint; i < this.lastIndex; i += 1) {
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

  load(draws: Array<Draw>, lastIndex: number) {
    if (lastIndex > this.limit) {
      this.firstIndex = lastIndex - this.limit
      this.lastIndex = this.firstIndex

      for (let i = 0; i < draws.length; i += 1) {
        this.add(draws[this.firstIndex + i])
      }
    } else {
      for (let i = 0; i < draws.length; i += 1) {
        this.add(draws[this.firstIndex])
      }
    }
  }
}
