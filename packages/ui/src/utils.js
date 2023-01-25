import { PLAYER_MAINNET_TIMESTAMP, PIXEL_SIZE, TIMEZONE } from '@/constants'
import { format, formatDistance } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export function formatNumber(num) {
  num += ''
  const splitedNumber = num.split('.')
  const decimals = splitedNumber.length > 1 ? '.' + splitedNumber[1] : ''
  const rgx = /(\d)(?=(\d{3})+(?!\d))/g
  const unit = splitedNumber[0].replace(rgx, '$1,')
  return unit + decimals
}

export function isMainnetTime() {
  return Date.now() >= PLAYER_MAINNET_TIMESTAMP * 1000
}

export function standardizePixelCoordinates(coordinate) {
  return coordinate > 0 ? coordinate / PIXEL_SIZE : coordinate
}

export function formatDate(timestamp) {
  try {
    return format(utcToZonedTime(timestamp, TIMEZONE), 'yyyy-MM-dd HH:mm:ss')
  } catch (err) {
    return
  }
}

export function formatDistanceFromNow(timestamp) {
  try {
    return formatDistance(
      utcToZonedTime(timestamp, TIMEZONE),
      utcToZonedTime(new Date(), TIMEZONE),
      {
        includeSeconds: true,
        addSuffix: true,
      }
    )
  } catch (err) {
    return
  }
}
