import { Player } from '../../../src/domain/player'
import { mapLeaves, PlayersTree } from '../../../src/services/playersTree'

function playerFactory(score: number, creationIndex: number): Player {
  return new Player({
    score,
    creationIndex,
    color: 2,
    key: String(creationIndex),
    username: '',
    palette: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
    },
    nft: [],
    token: '',
  })
}

function playersFactory(quantity: number): Array<Player> {
  return new Array(quantity)
    .fill(null)
    .map((_, index: number) => playerFactory(index + index, index))
}

describe('playersTree', () => {
  it('should set initialized to true after call initialize', () => {
    const players = playersFactory(5)
    const tree = new PlayersTree()

    const initializedBefore = tree.isInitialized()
    tree.initialize(players)
    const initializedAfter = tree.isInitialized()

    expect(initializedBefore).toBe(false)
    expect(initializedAfter).toBe(true)
  })

  it('should return the root of the tree', () => {
    const players = playersFactory(5)
    const tree = new PlayersTree()

    tree.initialize(players)

    const root = tree.getRoot()

    expect(root).toBe(
      '0x6e55fa4626842065d83d46f5d7a0ae22f3cf3f14e7437b40a71f36b1c7ae6e5b'
    )
  })

  // árbol de 5 hojas: con proof válido, con proof inválido generado por cambiar el score de la hoja de prueba, con proof inválido por cambiar cualquiera de las otras hojas

  //cambiar el valor sobre el que vamos a emitir la prueba
  it('roots of permuted maps match', () => {
    const playersA1 = [
      { creationIndex: 0, score: 5 },
      { creationIndex: 17, score: 23 },
      { creationIndex: 3, score: 77 },
      { creationIndex: 123, score: 0 },
      { creationIndex: 521, score: 69 },
    ]
    const playersA2 = [
      { creationIndex: 17, score: 23 },
      { creationIndex: 0, score: 5 },
      { creationIndex: 3, score: 77 },
      { creationIndex: 123, score: 0 },
      { creationIndex: 521, score: 69 },
    ]

    // const leavesA1 = mapLeaves(playersA1) as Array<string>
    // const leavesA2 = mapLeaves(playersA2) as Array<string>

    const merkleA1 = new PlayersTree()
    const merkleA2 = new PlayersTree()

    merkleA1.initialize(playersA1)
    merkleA2.initialize(playersA2)

    // const proofIndex17A1 = merkleA1.getProof(leavesA1[1])
    // const proofIndex17A2 = merkleA1.getProof(leavesA2[0])

    expect(merkleA1.getRoot()).toStrictEqual(merkleA2.getRoot())
  })

  it('proofs of same leaf in permuted maps match', () => {
    const playersA1 = [
      { creationIndex: 0, score: 5 },
      { creationIndex: 17, score: 23 },
      { creationIndex: 3, score: 77 },
      { creationIndex: 123, score: 0 },
      { creationIndex: 521, score: 69 },
    ]
    const playersA2 = [
      { creationIndex: 17, score: 23 },
      { creationIndex: 0, score: 5 },
      { creationIndex: 3, score: 77 },
      { creationIndex: 123, score: 0 },
      { creationIndex: 521, score: 69 },
    ]

    const leavesA1 = mapLeaves(playersA1) as Array<string>
    const leavesA2 = mapLeaves(playersA2) as Array<string>

    const merkleA1 = new PlayersTree()
    const merkleA2 = new PlayersTree()

    merkleA1.initialize(playersA1)
    merkleA2.initialize(playersA2)

    const proofIndex17A1 = merkleA1.getProof(leavesA1[1]) as Array<string>
    const proofIndex17A2 = merkleA1.getProof(leavesA2[0]) as Array<string>

    for (let i = 0; i < proofIndex17A1?.length; i++) {
      expect(proofIndex17A1[i]).toStrictEqual(proofIndex17A2[i])
    }
  })
})
