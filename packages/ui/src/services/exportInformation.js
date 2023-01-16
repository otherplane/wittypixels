import { BASE_URL } from '../constants'

export function createImportLink() {
  const tokenInfo = JSON.parse(localStorage.getItem('tokenInfo'))
  if (tokenInfo) {
    const { key, username, token } = JSON.parse(
      localStorage.getItem('tokenInfo')
    )
    return `${BASE_URL}/#/import?key=${key}&username=${username}&token=${token}`
  }
}
