import { BonusValidator } from '../../../src/services/bonusValidator'

describe('bonusValidator.ts', () => {
  it('should return TRUE if the element is included in the list', () => {
    const bonus = 'c20542b4bec4f780'

    const validator = new BonusValidator('test', 10)

    expect(validator.isValid(bonus)).toBeTruthy()
  })

  it('should return FALSE if the element not included in the list', () => {
    const invalidBonus = 'c20542b4bec4f780'

    const validator = new BonusValidator('test', 9)

    expect(validator.isValid(invalidBonus)).toBeFalsy()
  })
})
