const { assert } = require('chai')
// const truffleAssert = require("truffle-assertions");
const WitmonLiscon21 = artifacts.require('WitmonLiscon21')

contract('WitmonLiscon21', _accounts => {
  let decorator
  // const phenotype1 =
  //   "0xb754d49eec4434a3bd789100715ca6a0f7230fe7b66a2cd93457616128bbc5c2";

  before(async () => {
    decorator = await WitmonLiscon21.deployed()
  })

  describe('WitmonDecoratorBase', async () => {
    describe('baseURI()', async () => {
      let baseURI
      it('returns no empty string', async () => {
        baseURI = await decorator.baseURI.call()
        assert(baseURI.length > 0)
      })
      it('ends up with slash', () => {
        assert(baseURI[baseURI.length - 1] === '/')
      })
    })
  })

  describe('IWitmonDecorator', async () => {
    describe('getCreatureMetadata(Creature)', async () => {
      let metadata
      it('common creatures', async () => {
        for (let j = 0; j < 50; j++) {
          metadata = await decorator.getCreatureMetadata.call([
            j,
            0,
            j,
            10000 - j * 100,
            j + 1,
            '0x' + '0'.repeat(64 - j.toString(16).length) + j.toString(16),
            2,
          ])
          // generates valid JSON
          metadata = JSON.parse(metadata)
          // name contains tokenId
          assert(metadata.name.indexOf(j.toString()) >= 0, 'invalid JSON')
          // external url contains tokenId
          assert(metadata.external_url.indexOf(j.toString()) >= 0)
          // contains no eyewear attribute
          assert(
            metadata.attributes.filter(val => {
              if (val.trait_type && val.trait_type === 'Eyewear') {
                return val
              }
            }).length == 0,
            'contains eyewear attribute'
          )
          // contains no background attribute
          assert(
            metadata.attributes.filter(val => {
              if (val.trait_type && val.trait_type === 'Background') {
                return val
              }
            }).length == 0,
            'contains background attribute'
          )
          // trace
          console.log(j, '=>', metadata.attributes)
        }
      })
      it('rare creatures', async () => {
        for (let j = 50; j < 100; j++) {
          metadata = await decorator.getCreatureMetadata.call([
            j,
            0,
            j,
            10000 - j * 100,
            j + 1,
            '0x' + '0'.repeat(64 - j.toString(16).length) + j.toString(16),
            1,
          ])
          // generates valid JSON
          metadata = JSON.parse(metadata)
          // name contains tokenId
          assert(metadata.name.indexOf(j.toString()) >= 0, 'invalid JSON')
          // external url contains tokenId
          assert(metadata.external_url.indexOf(j.toString()) >= 0)
          // contains no background attribute
          assert(
            metadata.attributes.filter(val => {
              if (val.trait_type && val.trait_type === 'Background') {
                return val
              }
            }).length == 0,
            'contains background attribute'
          )
          // trace
          console.log(j, '=>', metadata.attributes)
        }
      })
      it('legendary creatures', async () => {
        for (let j = 100; j < 150; j++) {
          metadata = await decorator.getCreatureMetadata.call([
            j,
            0,
            j,
            50000 - j * 100,
            j + 1,
            '0x' + '0'.repeat(64 - j.toString(16).length) + j.toString(16),
            0,
          ])
          // generates valid JSON
          metadata = JSON.parse(metadata)
          // name contains tokenId
          assert(metadata.name.indexOf(j.toString()) >= 0, 'invalid JSON')
          // external url contains tokenId
          assert(metadata.external_url.indexOf(j.toString()) >= 0)
          // contains background attribute
          assert(
            metadata.attributes.filter(val => {
              if (val.trait_type && val.trait_type === 'Background') {
                return val
              }
            }).length > 0,
            'contains NO background attribute'
          )
          // trace
          console.log(j, '=>', metadata.attributes)
        }
      })
    })
  })
})
