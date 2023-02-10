export class BonusValidator {
  bonusList: Set<string>

  constructor(bonusList: Array<string>) {
    this.bonusList = new Set(bonusList)
  }

  isValid(bonusUrl: string): boolean {
    return this.bonusList.has(bonusUrl)
  }
}
