export class CanvasCache {
  lastB64: string
  checkpoint: number

  constructor(b64: string) {
    this.lastB64 = b64
    this.checkpoint = 0
  }

  public add(b64: string) {
    this.lastB64 = b64
    this.checkpoint += 1
  }

  hasLatestCanvas(checkpoint: number) {
    return checkpoint !== this.checkpoint
  }

  getCanvas() {
    return {
      canvas: this.lastB64,
      checkpoint: this.checkpoint,
    }
  }
}
