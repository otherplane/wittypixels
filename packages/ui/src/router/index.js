import { createRouter, createWebHashHistory } from 'vue-router'
import { useStore } from '@/stores/player'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/App.vue'

import Home from '../views/App.vue'
import MainContent from '../views/MainContent.vue'
import InitGame from '../views/InitGame.vue'
import Disclaimer from '../views/GameDisclaimer.vue'
import Instructions from '../views/GameInstructions.vue'
import LeaderBoard from '../views/LeaderBoard.vue'
import InteractionHistory from '../views/InteractionHistory.vue'
import ScanId from '../views/ScanId.vue'

export const pinia = createPinia()

const app = createApp(App)
app.use(pinia)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      const loginInfo = store.getToken()
      if (loginInfo && loginInfo.token) {
        next({ name: 'main', params: { id: loginInfo.key } })
      } else {
        next('init-game')
      }
    },
  },
  {
    name: 'disclaimer',
    path: '/disclaimer',
    component: Disclaimer,
  },
  {
    name: 'main',
    path: '/:id',
    component: MainContent,
  },
  {
    name: 'init-game',
    path: '/init-game',
    component: InitGame,
    beforeEnter: async (to, from, next) => {
      const store = useStore()
      const loginInfo = store.getToken()
      const claimedPlayerError =
        store.errors.info &&
        store.errors.info.includes('Player has not been claimed yet')
      const error = store.errors.info
      if (loginInfo && claimedPlayerError) {
        store.clearTokenInfo()
      }
      if (loginInfo && loginInfo.token && !error) {
        next({ name: 'main', params: { id: loginInfo.key } })
      } else {
        next()
      }
    },
  },
  {
    name: 'scan',
    path: '/scan',
    component: ScanId,
  },
  {
    name: 'leaderboard',
    path: '/leaderboard',
    component: LeaderBoard,
  },
  {
    name: 'interactionHistory',
    path: '/interactions',
    component: InteractionHistory,
  },
  {
    name: 'instructions',
    path: '/instructions',
    component: Instructions,
  },
  {
    name: 'import',
    path: '/import',
    beforeEnter: (to, from, next) => {
      const { username, token, key } = to.query
      const transactionHash = to.query.transactionHash
      const blockHash = to.query.blockHash

      if (!username || !token || !key) {
        next('/')
      } else {
        localStorage.setItem(
          'tokenInfo',
          JSON.stringify({ username, token, key })
        )
        if (transactionHash) {
          localStorage.setItem(
            'mintInfo',
            JSON.stringify({ transactionHash, blockHash })
          )
        }
        next(`/${key}`)
      }
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(to => {
  const playerStore = useStore()

  if (to.meta.requiresAuth && !playerStore.isLoggedIn) return '/login'
})

export default router
