<template>
  <div>
    <div
      v-if="gameEntity === 'players' && player.playersGlobalStats"
      class="list"
    >
      <PlayerGlobalData
        v-for="(player, index) in player.playersGlobalStats.players"
        :class="{ even: index % 2 }"
        :index="index"
        :key="player.username"
        :name="player.username"
        :position="player.position + 1"
        :score="player.score"
      />
      <CustomPagination
        v-if="numberPages > 1"
        :limit="numberPages"
        @update-page="updateCurrentPage"
      />
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { computed, onBeforeMount, ref, watch } from 'vue'
export default {
  props: {
    gameEntity: {
      type: String,
      required: true,
    },
    entityAttribute: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const player = useStore()
    // paginate data
    const currentPage = ref(0)
    const limit = ref(25)
    const numberPages = computed(() => {
      return Math.ceil((player.playersGlobalStats?.total || 0) / limit.value)
    })
    const offset = computed(() => {
      return limit.value * currentPage.value
    })
    onBeforeMount(async () => {
      await player.getGlobalStats()
    })
    watch(currentPage, async () => {
      await player.getGlobalStats(offset.value, limit.value)
    })
    function updateCurrentPage(page) {
      currentPage.value = page
    }
    // filter list by attribute
    function filterListByLabel({ list, label }) {
      const filter = label === 'overall' ? 'score' : label
      return list.sort((a, b) => {
        return b[filter] - a[filter] || a.creationIndex - b.creationIndex
      })
    }
    const sortedPlayersData = computed(() =>
      filterListByLabel({
        list: player.playerGlobalStats || [],
        label: props.entityAttribute,
      })
    )
    return {
      sortedPlayersData,
      player,
      updateCurrentPage,
      numberPages,
    }
  },
}
</script>
<style lang="scss" scoped>
.even {
  background: var(--primary-color-opacity-2);
  border-radius: 4px;
}
.list-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 40px;
}
@media (max-width: 600px) {
  .list-container {
    grid-template-columns: 1fr;
  }
}
</style>
