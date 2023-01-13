import { Color, DbInteractionVTO } from '../types'

export class Interaction {
  public from: string
  public to: string
  public quantity: number
  public color: Color
  public timestamp: number
  public ends: number

  constructor(vto: DbInteractionVTO) {
    this.from = vto.from
    this.to = vto.to
    this.quantity = vto.quantity
    this.color = vto.color
    this.timestamp = vto.timestamp
    this.ends = vto.ends
  }

  toVTO(): DbInteractionVTO {
    return {
      from: this.from,
      to: this.to,
      quantity: this.quantity,
      color: this.color,
      timestamp: this.timestamp,
      ends: this.ends,
    }
  }

  isActive(): boolean {
    return this.ends > Date.now()
  }
}
