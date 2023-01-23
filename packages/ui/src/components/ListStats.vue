<template>
  <div>
    <div
      v-if="gameEntity === 'players' && player.playersGlobalStats"
      class="list"
    >
      <PlayerGlobalData
        v-for="(player, index) in player.playersGlobalStats"
        :class="{ even: index % 2 }"
        :index="index"
        :key="player.username"
        :name="player.username"
        :position="player.position + 1"
        :score="player.score"
      />
      <CustomInfiniteLoading
        :getItems="player.getGlobalStats"
        :total="totalGlobalItems"
        :list="player.playersGlobalStats || []"
        @result="pushGlobalItems"
      />
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { ref } from 'vue'
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
    const totalGlobalItems = ref(0)
    const pushGlobalItems = items => {
      if (items) {
        player.playersGlobalStats.push(...items.result)
        totalGlobalItems.value = items.total
      }
    }
    return {
      player,
      totalGlobalItems,
      pushGlobalItems,
    }
  },
}
</script>
<style lang="scss" scoped>
.even {
  background: $transparent-lightgrey;
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
