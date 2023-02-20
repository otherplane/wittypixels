import QuickLRU from 'quick-lru'

export class CanvasCache {
  lru: QuickLRU<number, string>
  checkpoint: number

  constructor(base64: string, checkpoint: number) {
    this.checkpoint = checkpoint || 0
    this.lru = new QuickLRU({ maxSize: 1000 })

    this.lru.set(this.checkpoint, base64)
  }

  public add(b64: string) {
    this.checkpoint += 1
    this.lru.set(this.checkpoint, b64)
  }

  hasLatestCanvas(checkpoint: number) {
    return checkpoint !== this.checkpoint
  }

  getCanvas(checkpoint?: number) {
    const targetCheckpoint = checkpoint || this.checkpoint

    return {
      canvas: this.lru.get(targetCheckpoint),
      checkpoint: this.checkpoint,
    }
  }
}
