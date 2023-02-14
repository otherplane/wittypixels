import { Player } from '../../../src/domain/player'

describe('player.ts', () => {
  describe('isValidName', () => {
    it('should return false if no name is passed', () => {
      const name = ''

      const isValidName = Player.isValidName(name)

      expect(isValidName).toBe(false)
    })

    it('should return false if name lenght is lower than 3', () => {
      const name = 'ab'

      const isValidName = Player.isValidName(name)

      expect(isValidName).toBe(false)
    })

    it('should return false if name lenght is greather than 30', () => {
      const name = 'aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz'

      const isValidName = Player.isValidName(name)

      expect(isValidName).toBe(false)
    })

    it('should return true if name is greater than 2 and smaller than 35', () => {
      const name = 'fabada'

      const isValidName = Player.isValidName(name)

      expect(isValidName).toBe(true)
    })
  })
})
