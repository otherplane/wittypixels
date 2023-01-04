import { authenticatePlayer, initialPlayers } from '../../setup'

describe('authentication.ts', () => {
  it('should authenticate PLAYER #0', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    expect(token).toBeTruthy()
  })

  it('should authenticate PLAYER #1', async () => {
    const token = await authenticatePlayer(initialPlayers[1].key)

    expect(token).toBeTruthy()
  })
})
