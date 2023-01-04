const { assert } = require('chai')
const truffleAssert = require('truffle-assertions')
const WitmonERC721 = artifacts.require('WitmonERC721')
const WitmonLiscon21 = artifacts.require('WitmonLiscon21')
const WitnetRequestBoardMock = artifacts.require('WitnetRequestBoardMock')

contract('WitmonERC721', accounts => {
  let witmon
  let owner = accounts[0]
  let stranger = accounts[1]
  let signator = accounts[4]
  let eggOwner0 = '0x184cc5908e1a3d29b4d31df67d99622c4baa7b71'
  let eggOwner1 = accounts[2]
  let eggOwner2 = accounts[3]
  let eggSignator = '0x12890D2cce102216644c59daE5baed380d84830c'
  before(async () => {
    witmon = await WitmonERC721.new(
      WitnetRequestBoardMock.address,
      WitmonLiscon21.address, // decorator
      'Witty Creatures 2.0', // name
      'WITMON', // symbol
      signator, // signator
      [10, 30, 60], // percentile marks
      80640 // expirationDays (~ 14 days)
    )
  })
  describe('State-machine happy path', async () => {
    describe("In status: 'Batching'", async () => {
      beforeEach(async () => {
        let status = await witmon.getStatus.call()
        assert.equal(status.toString(), '0')
      })
      describe('IWitmonSurrogates', async () => {
        describe('mintCreature(..)', async () => {
          it('creatures cannot be minted', async () => {
            await truffleAssert.reverts(
              witmon.mintCreature(
                eggOwner0,
                0,
                1,
                800,
                2,
                '0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b'
              ),
              'not in Hatching'
            )
          })
        })
        describe('previewCreature(..)', async () => {
          it('creature images cannot be previewed', async () => {
            await truffleAssert.reverts(
              witmon.previewCreatureImage(
                eggOwner0,
                0,
                1,
                800,
                2,
                '0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b'
              ),
              'not in Hatching'
            )
          })
        })
      })
      describe('IWitmonView', async () => {
        describe('getCreatureStatus(..)', async () => {
          it("creature #0 is in 'Incubating' status", async () => {
            let cStatus = await witmon.getCreatureStatus.call(0)
            assert.equal(cStatus.toString(), '1')
          })
        })
      })
      describe('IWitmonAdmin', async () => {
        describe('setDecorator(..)', async () => {
          it('signator cannot change decorator', async () => {
            await truffleAssert.reverts(
              witmon.setDecorator(stranger, { from: signator }),
              'Ownable'
            )
          })
          it('stranger cannot change decorator', async () => {
            await truffleAssert.reverts(
              witmon.setDecorator(stranger, { from: stranger }),
              'Ownable'
            )
          })
          it('decorator cannot be set to zero', async () => {
            await truffleAssert.reverts(
              witmon.setDecorator(
                '0x0000000000000000000000000000000000000000',
                { from: owner }
              ),
              'no decorator'
            )
          })
          it('owner can change decorator', async () => {
            await witmon.setDecorator(WitmonLiscon21.address, { from: owner })
          })
        })
        describe('setParameters(..)', async () => {
          it('stranger cannot change parameters', async () => {
            await truffleAssert.reverts(
              witmon.setParameters(stranger, [10, 30, 60], 80640, {
                from: stranger,
              }),
              'Ownable'
            )
          })
          it('signator cannot change parameters', async () => {
            await truffleAssert.reverts(
              witmon.setParameters(stranger, [10, 30, 60], 80640, {
                from: signator,
              })
            )
          })
          it('signator cannot be set to zero', async () => {
            await truffleAssert.reverts(
              witmon.setParameters(
                '0x0000000000000000000000000000000000000000',
                [10, 30, 60],
                80640,
                { from: owner }
              )
            )
          })
          it('fails if bad number of percentiles is passed', async () => {
            await truffleAssert.reverts(
              witmon.setParameters(signator, [10, 30], 80640, { from: owner })
            )
          })
          it("fails if percentiles don't sum up 100", async () => {
            await truffleAssert.reverts(
              witmon.setParameters(signator, [10, 30, 55], 80640, {
                from: owner,
                gas: 100000,
              })
            )
          })
          it('owner can change valid parameters', async () => {
            await witmon.setParameters(eggSignator, [10, 30, 60], 80640, {
              from: owner,
            })
          })
        })
        describe('startHatching()', async () => {
          it('hatching cannot start', async () => {
            await truffleAssert.reverts(
              witmon.startHatching({ from: owner }),
              'not in Randomizing'
            )
          })
        })
        describe('stopBatching()', async () => {
          it('signator cannot stop batching', async () => {
            await truffleAssert.reverts(
              witmon.stopBatching({
                from: signator,
                value: 10 ** 10, // 10 gwei
              }),
              'Ownable'
            )
          })
          it('stranger cannot stop batching', async () => {
            await truffleAssert.reverts(
              witmon.stopBatching({
                from: stranger,
                value: 10 ** 10, // 10 gwei
              }),
              'Ownable'
            )
          })
          it('owner can stop batching', async () => {
            await witmon.stopBatching({
              from: owner,
              value: 10 ** 10, // 10 gwei
            })
            // check status changed to 'Randomizing'
            let status = await witmon.getStatus.call()
            assert.equal(status.toString(), '1')
          })
        })
      })
    })

    describe("In status: 'Randomizing'", async () => {
      beforeEach(async () => {
        let status = await witmon.getStatus.call()
        assert.equal(status.toString(), '1')
      })
      describe('IWitmonSurrogates', async () => {
        describe('mintCreature(..)', async () => {
          it('creatures cannot be minted', async () => {
            await truffleAssert.reverts(
              witmon.mintCreature(
                eggOwner0,
                0,
                1,
                800,
                2,
                '0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b'
              ),
              'not in Hatching'
            )
          })
        })
        describe('previewCreature(..)', async () => {
          it('creature images cannot be previewed', async () => {
            await truffleAssert.reverts(
              witmon.previewCreatureImage(
                eggOwner0,
                0,
                1,
                800,
                2,
                '0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b'
              ),
              'not in Hatching'
            )
          })
        })
      })
      describe('IWitmonView', async () => {
        describe('getCreatureStatus(..)', async () => {
          it("creature #0 is in 'Incubating' status", async () => {
            let cStatus = await witmon.getCreatureStatus.call(0)
            assert.equal(cStatus.toString(), '1')
          })
        })
      })
      describe('IWitmonAdmin', async () => {
        describe('setDecorator(..)', async () => {
          it('signator cannot change decorator', async () => {
            await truffleAssert.reverts(
              witmon.setDecorator(stranger, { from: signator }),
              'Ownable'
            )
          })
          it('stranger cannot change decorator', async () => {
            await truffleAssert.reverts(
              witmon.setDecorator(stranger, { from: stranger }),
              'Ownable'
            )
          })
          it('decorator cannot be set to zero', async () => {
            await truffleAssert.reverts(
              witmon.setDecorator(
                '0x0000000000000000000000000000000000000000',
                { from: owner }
              ),
              'no decorator'
            )
          })
          it('owner can change decorator', async () => {
            await witmon.setDecorator(WitmonLiscon21.address, { from: owner })
          })
        })
        describe('setParameters(..)', async () => {
          it('owner cannot change valid parameters', async () => {
            await truffleAssert.reverts(
              witmon.setParameters(signator, [10, 30, 60], 80640, {
                from: owner,
              }),
              'not in Batching'
            )
          })
          it('stranger cannot change parameters', async () => {
            await truffleAssert.reverts(
              witmon.setParameters(stranger, [10, 30, 60], 80640, {
                from: stranger,
              }),
              'Ownable'
            )
          })
          it('signator cannot change parameters', async () => {
            await truffleAssert.reverts(
              witmon.setParameters(stranger, [10, 30, 60], 80640, {
                from: signator,
              })
            )
          })
        })
        describe('stopBatching()', async () => {
          it('signator cannot stop batching', async () => {
            await truffleAssert.reverts(
              witmon.stopBatching({
                from: signator,
                value: 10 ** 10, // 10 gwei
              }),
              'Ownable'
            )
          })
          it('stranger cannot stop batching', async () => {
            await truffleAssert.reverts(
              witmon.stopBatching({
                from: stranger,
                value: 10 ** 10, // 10 gwei
              }),
              'Ownable'
            )
          })
          it('owner cannot stop batching', async () => {
            await truffleAssert.reverts(
              witmon.stopBatching({
                from: owner,
                value: 10 ** 10, // 10 gwei
              }),
              'not in Batching'
            )
          })
        })
        describe('startHatching()', async () => {
          it('signator cannot start hatching', async () => {
            await truffleAssert.reverts(
              witmon.startHatching({ from: signator }),
              'Ownable'
            )
          })
          it('stranger cannot start hatching', async () => {
            await truffleAssert.reverts(
              witmon.startHatching({ from: stranger }),
              'Ownable'
            )
          })
          it('owner can start hatching', async () => {
            await witmon.startHatching({ from: owner })
            // check status changed to 'Hatching'
            let status = await witmon.getStatus.call()
            assert.equal(status.toString(), '2')
          })
        })
      })
    })

    describe("In status: 'Hatching'", async () => {
      beforeEach(async () => {
        let status = await witmon.getStatus.call()
        assert.equal(status.toString(), '2')
      })
      describe('IWitmonAdmin', async () => {
        describe('setDecorator(..)', async () => {
          it('signator cannot change decorator', async () => {
            await truffleAssert.reverts(
              witmon.setDecorator(stranger, { from: signator }),
              'Ownable'
            )
          })
          it('stranger cannot change decorator', async () => {
            await truffleAssert.reverts(
              witmon.setDecorator(stranger, { from: stranger }),
              'Ownable'
            )
          })
          it('decorator cannot be set to zero', async () => {
            await truffleAssert.reverts(
              witmon.setDecorator(
                '0x0000000000000000000000000000000000000000',
                { from: owner }
              ),
              'no decorator'
            )
          })
          it('owner can change decorator', async () => {
            await witmon.setDecorator(WitmonLiscon21.address, { from: owner })
          })
        })
        describe('setParameters(..)', async () => {
          it('owner cannot change valid parameters', async () => {
            await truffleAssert.reverts(
              witmon.setParameters(signator, [10, 30, 60], 80640, {
                from: owner,
              }),
              'not in Batching'
            )
          })
          it('stranger cannot change parameters', async () => {
            await truffleAssert.reverts(
              witmon.setParameters(stranger, [10, 30, 60], 80640, {
                from: stranger,
              }),
              'Ownable'
            )
          })
          it('signator cannot change parameters', async () => {
            await truffleAssert.reverts(
              witmon.setParameters(stranger, [10, 30, 60], 80640, {
                from: signator,
              })
            )
          })
        })
        describe('stopBatching()', async () => {
          it('signator cannot stop batching', async () => {
            await truffleAssert.reverts(
              witmon.stopBatching({
                from: signator,
                value: 10 ** 10, // 10 gwei
              }),
              'Ownable'
            )
          })
          it('stranger cannot stop batching', async () => {
            await truffleAssert.reverts(
              witmon.stopBatching({
                from: stranger,
                value: 10 ** 10, // 10 gwei
              }),
              'Ownable'
            )
          })
          it('owner cannot stop batching', async () => {
            await truffleAssert.reverts(
              witmon.stopBatching({
                from: owner,
                value: 10 ** 10, // 10 gwei
              }),
              'not in Batching'
            )
          })
        })
        describe('startHatching()', async () => {
          it('signator cannot re-start hatching', async () => {
            await truffleAssert.reverts(
              witmon.startHatching({ from: signator }),
              'Ownable'
            )
          })
          it('stranger cannot re-start hatching', async () => {
            await truffleAssert.reverts(
              witmon.startHatching({ from: stranger }),
              'Ownable'
            )
          })
          it('owner cannot re-start hatching', async () => {
            await truffleAssert.reverts(
              witmon.startHatching({ from: owner }),
              'not in Randomizing'
            )
          })
        })
      })
      describe('IWitmonSurrogates', async () => {
        describe('mintCreature(..)', async () => {
          it('fails if trying to malleate egg owner when minting a new creature', async () => {
            await truffleAssert.reverts(
              witmon.mintCreature(
                stranger, // _eggOwner
                0, // _eggIndex
                1, // _eggRanking
                800, // _eggScore
                2, // _totalEggs
                '0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b'
              ),
              'bad signature'
            )
          })
          it('fails if trying to malleate egg index when minting a new creature', async () => {
            await truffleAssert.reverts(
              witmon.mintCreature(
                eggOwner0,
                1,
                1,
                800,
                2,
                '0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b'
              ),
              'bad signature'
            )
          })
          it('fails if trying to malleate egg score when minting a new creature', async () => {
            await truffleAssert.reverts(
              witmon.mintCreature(
                eggOwner0,
                0,
                1,
                1800,
                2,
                '0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b'
              ),
              'bad signature'
            )
          })
          it('fails if trying to malleate egg ranking when minting a new creature', async () => {
            await truffleAssert.reverts(
              witmon.mintCreature(
                eggOwner0,
                0,
                2,
                800,
                2,
                '0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b'
              ),
              'bad signature'
            )
          })
          it('fails if trying to malleate totally claimed eggs when minting a new creature', async () => {
            await truffleAssert.reverts(
              witmon.mintCreature(
                eggOwner0,
                0,
                1,
                800,
                25,
                '0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b'
              ),
              'bad signature'
            )
          })
          it('common creature can be minted by anyone', async () => {
            await witmon.mintCreature(
              eggOwner0,
              0, // _eggIndex
              1, // _eggRanking
              800, // _eggScore
              2, // _eggTotalClaimedEggs
              // eslint-disable-next-line max-len
              '0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b',
              { from: stranger }
            )
            // checks that creature #0 is now in 'Alive' status:
            let _status = await witmon.getCreatureStatus.call(0)
            assert.equal(_status.toString(), '3')
            // checks the new creature was assigned 1 as tokenId:
            let _data = await witmon.getCreatureData.call(0)
            assert.equal(_data.tokenId.toString(), '1')
            // checks creature category is Common
            assert.equal(_data.eggCategory.toString(), '2')
          })
          it('minted common creature cannot be minted twice', async () => {
            truffleAssert.reverts(
              witmon.mintCreature(
                eggOwner0,
                0, // _eggIndex
                1, // _eggRanking
                800, // _eggScore
                2, // _eggTotalClaimedEggs
                // eslint-disable-next-line max-len
                '0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b',
                { from: stranger }
              ),
              'already minted'
            )
          })
          it('legendary creature can be minted by anyone', async () => {
            await witmon.mintCreature(
              eggOwner1,
              1, // _eggIndex
              10, // _eggRanking
              800, // _eggScore
              100, // _eggTotalClaimedEggs
              // eslint-disable-next-line max-len
              '0x6b880a72e2b1fc60100ef883e74235ac5eca355985a308ef60221e819a3f151a5eb421d0a3c352449afef51e572c491c8d905761844d7ff064bf4718294a0c181c',
              { from: stranger }
            )
            // checks that creature #1 is now in 'Alive' status:
            let _status = await witmon.getCreatureStatus.call(1)
            assert.equal(_status.toString(), '3')
            // checks the new creature was assigned 2 as tokenId:
            let _data = await witmon.getCreatureData.call(1)
            assert.equal(_data.tokenId.toString(), '2')
            // checks creature category is Legendary
            assert.equal(_data.eggCategory.toString(), '0')
          })
          it('rare creature can be minted by anyone', async () => {
            await witmon.mintCreature(
              eggOwner2,
              2,
              40,
              800,
              100,
              '0x3a59a87d0b07063fd5e968d70ce4446160fe8cbef3da7812afd1147b4fc2eabb7e2481fe85c77bc175bbd347291feb8adf25f489be409bcdf8759767761c16a81c'
            )
            // checks that creature #2 is now in 'Alive' status:
            let status = await witmon.getCreatureStatus.call(2)
            assert.equal(status.toString(), '3')
            // checks the new creature was assigned 3 as tokenId:
            let data = await witmon.getCreatureData.call(2)
            assert.equal(data.tokenId.toString(), '3')
            // checks creature category is Rare
            assert.equal(data.eggCategory.toString(), '1')
          })
        })
        describe('previewCreature(..)', async () => {
          it('minted creature can be previewed by anyone', async () => {
            witmon.previewCreatureImage(
              eggOwner0,
              0, // _eggIndex
              1, // _eggRanking
              800, // _eggScore
              2, // _eggTotalClaimedEggs
              // eslint-disable-next-line max-len
              '0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b',
              { from: stranger }
            )
            // checks that creature #0 continues in 'Hatching' status:
            let _status = await witmon.getCreatureStatus.call(0)
            assert.equal(_status.toString(), '3')
            // console.log(
            await witmon.previewCreatureImage.call(
              eggOwner0,
              0, // _eggIndex
              1, // _eggRanking
              800, // _eggScore
              2, // _eggTotalClaimedEggs
              // eslint-disable-next-line max-len
              '0xbd8846c16175582d498d6bbf26513cb5dd932f980c5a3033a660be7dd2f5d05072fbd26b22ce700e3b09c8c11f6af2e8977cc21790535847d79166898cd6f5c61b',
              { from: stranger }
            )
            // )
          })
          it('unminted creature can by previewed by anyone', async () => {
            // console.log(
            await witmon.previewCreatureImage.call(
              eggOwner2,
              0, // _eggIndex
              40, // _eggRanking
              800, // _eggScore
              100, // _eggTotalClaimedEggs
              // eslint-disable-next-line max-len
              '0x0d71bc5a298b7e945191ccaf7b3a5d8cfb4cd95c58adaadd8901b4fdeea7320e523dbf885bf88c3cbc286bfcb4c74ad4d017127ca2c4a36542015debb3957ff51b',
              { from: stranger }
            )
            // )
          })
        })
      })
      describe('IWitmonView', async () => {
        describe('getCreatureData(_eggIndex)', async () => {
          it('data of a previously minted common creature should be valid', async () => {
            let data = await witmon.getCreatureData.call(0)
            // console.log(data)
            assert.equal(data.tokenId.toString(), '1')
            assert.equal(data.eggIndex.toString(), '0')
            assert.equal(data.eggScore.toString(), '800')
            assert.equal(data.eggRanking.toString(), '1')
            assert.equal(data.eggCategory.toString(), '2')
          })
          it('data of a previously minted legendary creature should be valid', async () => {
            let data = await witmon.getCreatureData.call(1)
            // console.log(data)
            // assert.equal(data.eggOwner, eggOwner1)
            assert.equal(data.tokenId.toString(), '2')
            assert.equal(data.eggIndex.toString(), '1')
            assert.equal(data.eggScore.toString(), '800')
            assert.equal(data.eggRanking.toString(), '10')
            assert.equal(data.eggCategory.toString(), '0')
          })
        })
        describe('getCreatureImage(_eggIndex)', async () => {
          it('getting images from minted creatures works', async () => {
            await witmon.getCreatureImage.call(0)
            await witmon.getCreatureImage.call(1)
          })
          it('getting image from unminted creature fails', async () => {
            await truffleAssert.reverts(
              witmon.getCreatureImage.call(11),
              'not alive yet'
            )
          })
        })
        describe('getCreatureStatus(_eggIndex)', async () => {
          it("common creature #0 is in 'Alive' status", async () => {
            let cStatus = await witmon.getCreatureStatus.call(0)
            assert.equal(cStatus.toString(), '3')
          })
          it("legendary creature #1 is in 'Alive' status", async () => {
            let cStatus = await witmon.getCreatureStatus.call(1)
            assert.equal(cStatus.toString(), '3')
          })
          it("rare creature #2 is in 'Alive' status", async () => {
            let cStatus = await witmon.getCreatureStatus.call(2)
            assert.equal(cStatus.toString(), '3')
          })
          it("inexistent creature #3 is in 'Hatching' status", async () => {
            let cStatus = await witmon.getCreatureStatus.call(3)
            assert.equal(cStatus.toString(), '2')
          })
        })
        describe('totalSupply()', async () => {
          it('totalSupply should have increased to 3', async () => {
            let totalSupply = await witmon.totalSupply.call()
            assert.equal(totalSupply.toString(), '3')
          })
        })
      })
      describe('ERC721Metadata', async () => {
        describe('baseURI()', async () => {
          let baseURI
          it('returns no empty string', async () => {
            baseURI = await witmon.baseURI.call()
            assert(baseURI.length > 0)
          })
          it('ends up with slash', () => {
            assert(baseURI[baseURI.length - 1] === '/')
          })
        })
        describe('metadata(_tokenId)', async () => {
          it('metadata of a previously minted creature should be valid', async () => {
            let metadata = await witmon.metadata.call(1)
            // remove non-printable and other non-valid JSON chars
            metadata = JSON.parse(metadata)
            assert.equal(
              metadata.external_url,
              'https://api-liscon21.wittycreatures.com/metadata/1'
            )
          })
          it('getting metadata from inexistent token fails', async () => {
            await truffleAssert.reverts(
              witmon.metadata.call(11),
              'inexistent token'
            )
          })
        })
        describe('tokenURI(_tokenId)', async () => {
          it('tokenURI of a previously minted creature should be valid', async () => {
            let tokenURI = await witmon.tokenURI.call(1)
            assert.equal(
              tokenURI,
              'https://api-liscon21.wittycreatures.com/metadata/1'
            )
            tokenURI = await witmon.tokenURI.call(2)
            assert.equal(
              tokenURI,
              'https://api-liscon21.wittycreatures.com/metadata/2'
            )
            tokenURI = await witmon.tokenURI.call(3)
            assert.equal(
              tokenURI,
              'https://api-liscon21.wittycreatures.com/metadata/3'
            )
          })
          it('getting tokenURI from inexistent token fails', async () => {
            await truffleAssert.reverts(
              witmon.tokenURI.call(11),
              'inexistent token'
            )
          })
        })
      })
      describe('ERC721', async () => {
        describe('transferFrom(..), approve(..)', async () => {
          it("tender cannot transfer eggOwner0's token #1 to eggOwner1", async () => {
            await truffleAssert.reverts(
              witmon.transferFrom(eggOwner0, eggOwner1, 1, { from: owner }),
              'not owner nor approved'
            )
          })
          it('eggOwner1 can transfer its token #2 to eggOwner2, without previous approval', async () => {
            await witmon.transferFrom(eggOwner1, eggOwner2, 2, {
              from: eggOwner1,
            })
            let balance2 = await witmon.balanceOf.call(eggOwner2)
            assert.equal(balance2.toString(), '2')
          })
          it("tender cannot approve eggOwner1 concerning eggOwner2's token #3", async () => {
            await truffleAssert.reverts(
              witmon.approve(eggOwner1, 3, { from: owner }),
              'not owner nor approved'
            )
          })
          it("eggOwner1 cannot transfer eggOwner2's token #3, without previous approval", async () => {
            await truffleAssert.reverts(
              witmon.transferFrom(eggOwner2, eggOwner1, 3, { from: eggOwner1 }),
              'not owner nor approved'
            )
          })
          it('eggOwner2 can approve eggOwner1 concerning token #3', async () => {
            await witmon.approve(eggOwner1, 3, { from: eggOwner2 })
            let approved = await witmon.getApproved.call(3)
            assert.equal(approved, eggOwner1)
          })
          it("eggOwner1 can transfer eggOwner2's token #3, after previous approval", async () => {
            await witmon.transferFrom(eggOwner2, eggOwner1, 3, {
              from: eggOwner1,
            })
          })
        })
        describe('balanceOf(..)', async () => {
          it('eggOwner0 owns one token', async () => {
            let balance0 = await witmon.balanceOf.call(eggOwner0)
            assert.equal(balance0.toString(), '1')
          })
          it('eggOwner1 owns one token', async () => {
            let balance1 = await witmon.balanceOf.call(eggOwner1)
            assert.equal(balance1.toString(), '1')
          })
          it('eggOwner2 owns one token', async () => {
            let balance2 = await witmon.balanceOf.call(eggOwner2)
            assert.equal(balance2.toString(), '1')
          })
          it('tender owner owns no tokens', async () => {
            let balance = await witmon.balanceOf.call(owner)
            assert.equal(balance.toString(), '0')
          })
          it('signator owns no tokens', async () => {
            let balance = await witmon.balanceOf.call(signator)
            assert.equal(balance.toString(), '0')
          })
        })
      })
    })
  })
})
