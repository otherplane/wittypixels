const { assert } = require('chai')
const truffleAssert = require('truffle-assertions')
const WitmonsTester = artifacts.require('WitmonsTester')

contract('Witmons library', _accounts => {
  let witmons
  before(async () => {
    witmons = await WitmonsTester.new()
  })
  describe('randomUniform(bytes32,uint256,uint8)', async () => {
    const phenotype1 =
      '0xb754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c2'
    const phenotype2 =
      '0xb754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c3'
    it('zero range fails', async () => {
      await truffleAssert.reverts(
        witmons.randomUniform.call(phenotype1, 0, 0),
        'VM Exception'
      )
    })
    it('variable result when called with same seed and range but different phenotype', async () => {
      let rnd1 = await witmons.randomUniform.call(phenotype1, 0, 255)
      let rnd2 = await witmons.randomUniform.call(phenotype2, 0, 255)
      assert(rnd1.toString() !== rnd2.toString())
    })
    it('variable result when called with same phenotype and range but different seed', async () => {
      let rnd1 = await witmons.randomUniform.call(phenotype1, 0, 128)
      let rnd2 = await witmons.randomUniform.call(phenotype1, 1, 128)
      assert(rnd1.toString() !== rnd2.toString())
    })
    it('same result when called with same parameters', async () => {
      let rnd1 = await witmons.randomUniform.call(phenotype2, 2, 4)
      let rnd2 = await witmons.randomUniform.call(phenotype2, 2, 4)
      assert.equal(rnd1.toString(), rnd2.toString())
    })
    it('performing full range test works', async () => {
      for (let j = 1; j < 256; j++) {
        await witmons.randomUniform.call(phenotype1, j, j)
      }
    })
    it('uniformity', async () => {
      let iters = []
      let seeds = [
        '0xc754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c2',
        '0xc754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c3',
        '0xc754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c4',
        '0xc754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c5',
        '0xc754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c6',
        '0xc754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c7',
        '0xc754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c8',
        '0xc754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c9',
        '0xc754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5ca',
        '0xc754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5cb',
        '0xc754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5cc',
      ]
      for (let i = 0; i < seeds.length; i++) {
        let sides = []
        sides.length = 3
        for (let j = 0; j < sides.length * 11; j++) {
          let rnd = await witmons.randomUniform.call(seeds[i], j, sides.length)
          sides[rnd] = sides[rnd] ? sides[rnd] + 1 : 1
        }
        iters.push(sides)
      }
      // console.log(JSON.stringify(iters))
    })
  })
})
