import { BonusValidator } from '../../../src/services/bonusValidator'

describe('bonusValidtor.ts', () => {
  it('should return TRUE if the element is included in the list', () => {
    const bonus = 'valid_bonus_1'

    const validator = new BonusValidator([bonus])

    expect(validator.isValid(bonus)).toBeTruthy()
  })

  it('should return FALSE if the element not included in the list', () => {
    const bonus = 'valid_bonus_1'
    const invalidBonus = 'valid_bonus_1'

    const validator = new BonusValidator([bonus])

    expect(validator.isValid(invalidBonus)).toBeTruthy()
  })
})
