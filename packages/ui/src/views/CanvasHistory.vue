<template>
  <MainLayout>
    <template v-slot:main>
      <div class="view-container">
        <SectionHeader title="Canvas history" />
        <GameInfo v-if="showEmptyState" class="empty-state">
          <div class="long-info bold">
            <p class="state-text">No canvas interaction yet.</p>
            <p>
              What are you waiting for? Start drawing pixels in the canvas and
              get WPX
            </p>
          </div>
        </GameInfo>
        <CanvasHistoryEntry
          v-for="(interaction, index) in player.canvasHistory"
          :key="interaction.timestamp"
          :class="{ even: index % 2 }"
          :color="getColor(interaction.color, 3).value"
          :x="interaction.x"
          :y="interaction.y"
          :owner="interaction.owner"
          :stolenTo="!isPixelStolen(interaction) ? interaction.stolenTo : null"
          :stolenFrom="isPixelStolen(interaction) ? interaction.owner : null"
          :timestamp="interaction.timestamp"
        />
        <CustomInfiniteLoading
          :getItems="player.getCanvasHistory"
          :list="player.canvasHistory || []"
          :total="totalItems"
          @result="pushItems"
        />
      </div>
    </template>
  </MainLayout>
</template>
<script>
import { useStore } from '@/stores/player'
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { formatDate } from '@/utils'
import { CallApiKey } from '@/types'
import { getColor } from '@/composables/getColor'
export default {
  setup() {
    const player = useStore()
    const timeZone = 'America/Denver'
    const totalItems = ref(0)
    const showEmptyState = computed(
      () =>
        !player.loadings[CallApiKey.canvasHistory] &&
        !player.canvasHistory.length
    )
    const pushItems = items => {
      if (items) {
        player.canvasHistory.push(...items.result)
        totalItems.value = items.total
      }
    }
    function isPixelStolen(interaction) {
      return (
        interaction?.stolenTo !== '' &&
        interaction?.stolenTo === player.username
      )
    }
    return {
      showEmptyState,
      CallApiKey,
      getColor,
      player,
      utcToZonedTime,
      timeZone,
      format,
      pushItems,
      totalItems,
      formatDate,
      isPixelStolen,
    }
  },
}
</script>
<style lang="scss" scoped>
.empty-state {
  margin-top: 16px;
}
.even {
  background: $transparent-lightgrey;
  border-radius: 4px;
}
.view-container {
  row-gap: 0px;
}
.interaction-label {
  color: var(--primary-color);
  font-weight: bold;
}
.highlight {
  color: var(--primary-color);
  font-weight: 600;
}
</style>
