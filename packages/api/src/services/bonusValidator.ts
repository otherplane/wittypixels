import { PLAYER_KEY_LENGTH_BYTES } from '../constants'
import crypto from 'crypto'

export class BonusValidator {
  bonusList: Set<string>

  constructor(salt: string, count: number) {
    this.bonusList = generateBonuses(salt, count)
  }

  isValid(bonusUrl: string): boolean {
    return this.bonusList.has(bonusUrl)
  }
}

function generateBonuses(salt: string, count: number): Set<string> {
  const bonuses: Array<string> = []
  for (let index = 0; index < count; index++) {
    const seed = crypto
      .createHash('sha256')
      .update(`${salt}|true|${index}`)
      .digest()
    const key: string = seed.slice(0, PLAYER_KEY_LENGTH_BYTES).toString('hex')
    bonuses.push(key)
  }

  return new Set(bonuses)
}
