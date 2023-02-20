/* eslint-disable no-unused-vars */
export type Pixel = {
  id: string
  author: string | null
  timestamp: number | null
  x: number
  y: number
  width: number
  height: number
  fill: string
  strokeWidth: number | null
  stroke: string
}
export type PixelDB = {
  x: number
  y: number
  c: number
  s?: number
  o?: string
  t?: number
}
export type SelectedPixel = {
  x: number
  y: number
  color: number
  shade: number
  timestamp: number
  owner: string
}
export enum ERC20Status {
  Awaiting = 'Awaiting',
  Randomizing = 'Randomizing',
  Auctioning = 'Auctioning',
  Acquired = 'Acquired',
}
export type ERC20Stats = {
  redeemedPixels: number
  redeemedPlayers: number
  totalPixels: number
  totalTransfers: number
  totalWithdrawals: number
}
export type ERC20ContractInfo = {
  status: ERC20Status
  stats: ERC20Stats
  // ETH/weis
  currentPrice: number
  // Future block number in which current price will change, if ever
  nextPriceBlock: number
}
export type ERC20WalletInfo = {
  wpxBalance: number
  // wallet’s percentage share, multiplied by a 100
  wpxShare10000: number
  // amount of funds that can be potentially witdrawn from walletAddr
  withdrawableWeis: number
  soulboundPixels: number
}
export type Provider = {
  network: string
  address: string
}
export type RedeemPlayerInfo = {
  // EVM address from which NFT ownership was redeemed
  address: string
  // Number of pixels redeemed by the UI’s player index
  pixels: number
}
export type ColorShade = Record<number, [number, number, number]>
export type ColorMap = Record<number, ColorShade>
export type GeneratePixelArgs = {
  x: number
  y: number
  color: string
  strokeColor?: string
}
export enum Position {
  right = 'right',
  left = 'left',
}
export enum ModalKey {
  export = 'export',
  preview = 'preview',
  gameOver = 'gameOver',
  redeem = 'redeem',
  txConfirmation = 'txConfirmation',
  txError = 'txError',
}
export interface Modals {
  [key: string]: boolean | null
}
export type Coordinates = {
  x: number
  y: number
}
export interface ColorsFromIndex {
  [key: number]: string
}
export interface NetworkMap {
  [key: number]: {
    name: string
    id: number
    contractAddress?: string
    rpcUrls?: Array<string>
    blockExplorerUrls?: Array<string>
    marketplace?: string
    marketplaceName?: string
    confirmationCount?: number
  }
}
export interface ColorFromHex {
  [key: string]: number
}
export interface PalettePoints {
  [key: number]: number
}
export interface PixelMap {
  [key: string]: Pixel
}
export type MintInfo = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events?: Array<any>
  blockHash: string
  txConfirmation?: boolean
  txHash?: string
  blockNumber: number
  txCount?: number
  from?: string
}
export type TxInfo = {
  txType?: TxType
  from?: string
  txHash?: string
  fromTxCount?: number
  blockNumber?: number
  blockHash?: string
  events?: Array<any>
  txConfirmation?: boolean
  externalConfirmation?: boolean
}
export enum TxType {
  Withdraw = 'Withdraw',
  Buy = 'Buy',
  Redeem = 'Redeem',
}
export enum GameOverStatus {
  Fractionalizing = 'Fractionalizing',
  AllowRedeem = 'AllowRedeem',
  AwaitSale = 'AwaitSale',
  AllowSale = 'AllowSale',
  AllowWithdraw = 'AllowWithdraw',
}
export enum TokenStatus {
  Void = 'void',
  Launching = 'launching',
  Minting = 'minting',
  Fractionalized = 'fractionalized',
  Acquired = 'Acquired',
}
export enum CallApiKey {
  preview = 'preview',
  auth = 'auth',
  interaction = 'interaction',
  info = 'info',
  history = 'history',
  canvasHistory = 'canvasHistory',
  interactionHistory = 'interactionHistory',
  getLeaderboardInfo = 'getLeaderboardInfo',
  network = 'network',
  getContractArgs = 'getContractArgs',
  redeem = 'redeem',
  canvas = 'canvas',
  paint = 'paint',
  pixel = 'pixel',
  bonus = 'bonus',
}
export enum InteractionType {
  interactionOut = 'interactionOut',
  interactionIn = 'interactionIn',
}
export type InteractionInfo = {
  ends: number
}
export enum GameOverErrorKey {
  transaction = 'transaction',
  tokenStatus = 'tokenStatus',
  tokenVault = 'tokenVault',
  web3WrongNetwork = 'web3WrongNetwork',
  web3Disconnected = 'web3Disconnected',
  contractArgs = 'contractArgs',
  gameStats = 'gameStats',
}
export enum TransactionStatus {
  Confirmed = 'Confirmed',
  InProgress = 'InProgress',
  Error = 'Error',
}
