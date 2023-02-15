import { PlayerCache } from '../../../src/services/playerCache'
function playerFactory(amount: number) {
  return new Array(amount).fill(null).map((_, index) => {
    return {
      name: index.toString(),
      username: (index + 200).toString(),
    }
  })
}
describe('playerCache', () => {
  it('should return player name', () => {
    const players = playerFactory(4)
    const cache = new PlayerCache(players)

    const result = cache.getName(players[0].username)

    expect(result).toStrictEqual('0')
  })
  it('should store player name', () => {
    const players = playerFactory(4)
    const cache = new PlayerCache(players)

    cache.add({ username: '201', name: '2x1' })
    const result = cache.getName(players[1].username)

    expect(result).toStrictEqual('2x1')
  })
})
