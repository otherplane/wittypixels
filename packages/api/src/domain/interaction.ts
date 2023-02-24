import { Color, DbInteractionVTO } from '../types'

export class Interaction {
  public from: string
  public fromName: string | undefined
  public to: string
  public toName: string | undefined
  public quantity: number
  public color: Color
  public timestamp: number
  public ends: number

  constructor(vto: DbInteractionVTO) {
    this.from = vto.from
    this.fromName = vto.fromName
    this.to = vto.to
    this.toName = vto.toName
    this.quantity = vto.quantity
    this.color = vto.color
    this.timestamp = vto.timestamp
    this.ends = vto.ends
  }

  toVTO(): DbInteractionVTO {
    return {
      from: this.from,
      fromName: this.fromName,
      to: this.to,
      toName: this.toName,
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
