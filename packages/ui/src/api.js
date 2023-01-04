import axios from 'axios'
import qs from 'query-string'
import { API_BASE_URL } from './constants'

export class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL
  }

  _handleResponse(response) {
    if (response && response.data) {
      return response.data
    }
  }

  _handleError(error) {
    return { error }
  }

  _get({ url, config }) {
    return axios
      .get(url, {
        ...config,
        paramsSerializer: params => qs.stringify(params),
      })
      .then(this._handleResponse)
      .catch(this._handleError)
  }

  _post({ url, data, params }) {
    return axios
      .post(url, data, params)
      .then(this._handleResponse)
      .catch(this._handleError)
  }

  authorize(params) {
    return this._post({
      url: `${this.baseUrl}/auth`,
      data: { key: params.key },
    })
  }

  getInfo(params) {
    return this._get({
      url: `${this.baseUrl}/players/${params.id}`,
      config: { headers: { authorization: params.token } },
    })
  }

  getInteractionsHistory(params) {
    return this._get({
      url: `${this.baseUrl}/interactions`,
      config: {
        headers: { authorization: params.token },
        params: { offset: params.offset, limit: params.limit },
      },
    })
  }

  getMintedAwardsImages(params) {
    return this._get({
      url: `${this.baseUrl}/players/images`,
      config: {
        headers: { authorization: params.token },
        params: { token_ids: params.tokenIds },
      },
    })
  }

  getPreviews(params) {
    return this._get({
      url: `${this.baseUrl}/players/preview`,
      config: {
        params: { key: params.key },
        headers: { authorization: params.token },
      },
    })
  }

  getInteractionHistory(params) {
    return this._get({
      url: `${this.baseUrl}/history`,
      config: {
        headers: { authorization: params.token },
        params: { offset: params.offset, limit: params.limit },
      },
    })
  }

  getLeaderboardInfo(params) {
    return this._get({
      url: `${this.baseUrl}/leaderboard`,
      config: { params: { offset: params.offset, limit: params.limit } },
    })
  }

  interact({ to, token }) {
    return this._post({
      url: `${this.baseUrl}/interactions`,
      data: { to },
      params: { headers: { authorization: token } },
    })
  }

  getContractArgs({ address, token }) {
    return this._post({
      url: `${this.baseUrl}/mint`,
      data: { address },
      params: { headers: { authorization: token } },
    })
  }
}
