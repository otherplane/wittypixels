export class PlayerCache {
  playerMap: Record<string, string>
  constructor(players: Array<{ name: string; username: string }>) {
    this.playerMap = players.reduce((playerMap, player) => {
      playerMap[player.username] = player.name || player.username
      return playerMap
    }, {} as Record<string, string>)
  }

  public add({ username, name }: { username: string; name: string }) {
    this.playerMap[username] = name
  }

  getName(username: string) {
    return this.playerMap[username]
  }
}
