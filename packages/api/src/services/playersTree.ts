import { MerkleTree } from 'merkletreejs'
import { Player } from '../domain/player'
import web3 from 'web3'
import BN from 'bn.js'

export class PlayersTree {
  tree?: MerkleTree
  initialized?: boolean

  public initialize(players: Array<Pick<Player, 'creationIndex' | 'score'>>) {
    const leaves = mapLeaves(players)

    this.tree = new MerkleTree(leaves, keccak256, {
      sort: true,
    })
    this.initialized = true
  }

  public getProof(leaf: string) {
    return this.tree?.getProof(leaf).map(x => `0x${x.data.toString('hex')}`)
  }

  public getRoot(): string {
    if (!this.initialized) {
      throw new Error('Merkle tree no initialized')
    }

    return `0x${this.tree?.getRoot().toString('hex')}`
  }

  isInitialized(): boolean {
    return !!this.initialized
  }
}

// Same type that the library receives
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function keccak256(x: any) {
  return web3.utils.soliditySha3({
    t: 'bytes',
    v: '0x' + x.toString('hex'),
  })
}

export function mapLeaves(
  players: Array<{ creationIndex: number; score: number }>
): Array<string | null> {
  return players.map(player => {
    return web3.utils.soliditySha3(
      { t: 'uint256', v: new BN(player.creationIndex) },
      { t: 'uint256', v: new BN(player.score) }
    )
  })
}
