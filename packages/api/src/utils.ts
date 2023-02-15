import {
  ERC20_TOKEN_START_TS,
  INTERACTION_COOLDOWN_MILLIS,
  INTERACTION_DURATION_MILLIS,
  PLAYER_MAINNET_TIMESTAMP,
  COLORS_COUNT,
} from './constants'

import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from 'unique-names-generator'

export function calculateRemainingCooldown(
  interactionEnds: number,
  currentTimestamp = Date.now(),
  interactionDuration: number = INTERACTION_DURATION_MILLIS,
  interactionCooldown: number = INTERACTION_COOLDOWN_MILLIS
) {
  const remainingMillis =
    interactionEnds -
    interactionDuration +
    interactionCooldown -
    currentTimestamp

  return remainingMillis > 0 ? remainingMillis : 0
}

export function calculateRemainingDuration(
  incubationEnds: number,
  currentTimestamp = Date.now()
) {
  const remainingMillis = incubationEnds - currentTimestamp

  return remainingMillis > 0 ? remainingMillis : 0
}

export function getColorFromIndex(index: number) {
  return index % COLORS_COUNT
}

export function isMainnetTime() {
  return Date.now() >= PLAYER_MAINNET_TIMESTAMP * 1000
}

export function fromHexToUint8Array(hex: string) {
  return Uint8Array.from(Buffer.from(hex.substring(2).padStart(64, '0'), 'hex'))
}

export function isTimeToMint() {
  return Date.now() >= ERC20_TOKEN_START_TS * 1000
}

export function printRemainingMillis(millis: number) {
  const seconds = Math.ceil(millis / 1000)
  if (seconds < 60) {
    return `${seconds} sec`
  } else {
    return `${Math.ceil(seconds / 60)} min`
  }
}

export function generateUsernameList(count: number): Array<string> {
  const usernames = new Set<string>()
  // The seed must start at 1 because 0 means "use Math.random"
  let counter = 1

  while (usernames.size < count) {
    const username = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      seed: counter,
      separator: '-',
      style: 'lowerCase',
    })
    usernames.add(username)
    counter += 1
  }

  // Convert set into array to allow indexing by index
  return Array.from(usernames)
}
