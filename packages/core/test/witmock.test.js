const { assert } = require('chai')

// Contracts
const WitmonMock = artifacts.require('WitmonMock')

contract('WitmonMock', _accounts => {
  describe('mintCreature(): ', () => {
    let witmock
    before(async () => {
      witmock = await WitmonMock.new(
        '0x12890D2cce102216644c59daE5baed380d84830c'
      )
    })

    it('should mint a new creature', async () => {
      const lol = await witmock.mintCreature(
        '0x184cc5908e1a3d29b4d31df67d99622c4baa7b71', // address _eggOwner,
        0, // uint256 _eggIndex,
        1, // uint256 _eggRanking,
        800, // uint256 _eggScore,
        2, // uint256 _totalEggs
        // eslint-disable-next-line max-len
        '0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b'
      )
      // assert.equal(hash, test.hash)
      assert.equal(lol.logs[0].event, 'NewCreature')
    })
  })
})
