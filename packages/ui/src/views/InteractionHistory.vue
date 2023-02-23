<template>
  <MainLayout>
    <template v-slot:main>
      <div class="view-container">
        <SectionHeader title="Interactions history" />
        <GameInfo v-if="showEmptyState" class="empty-state">
          <div class="long-info bold">
            <p class="state-text">No interactions yet.</p>
            <p>
              What are you waiting for? Go look for other players and ask them
              to scan your QR code now!
            </p>
          </div>
        </GameInfo>
        <LoadingSpinner v-if="loading" :vheight="60" />
        <InteractionEntry
          v-for="(interaction, index) in player.interactionHistory"
          :key="interaction.timestamp"
          :class="{ even: index % 2 }"
          :color="getColor(interaction.color, 3).value"
          :points="interaction.quantity"
          :from="interaction.to == player.username ? interaction.from : null"
          :to="interaction.from == player.username ? interaction.to : null"
          :timestamp="interaction.timestamp"
        />
        <CustomInfiniteLoading
          :getItems="player.getInteractionHistory"
          :list="player.interactionHistory || []"
          :total="totalItems"
          @loading="setLoading"
          @result="pushItems"
        />
      </div>
    </template>
  </MainLayout>
</template>
<script>
import { useStore } from '@/stores/player'
import { getColor } from '@/composables/getColor'
import { CallApiKey } from '@/types'
import { ref, computed, onBeforeUnmount } from 'vue'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { formatDate } from '@/utils'
import { COLORS } from '@/constants'
export default {
  setup() {
    const player = useStore()
    const timeZone = 'America/Denver'
    const totalItems = ref(0)
    const showEmptyState = computed(
      () =>
        !player.loadings[CallApiKey.interactionHistory] &&
        !player.interactionHistory.length
    )
    const loading = computed(
      () => player.loadings[CallApiKey.interactionHistory]
    )
    onBeforeUnmount(() => (player.interactionHistory = []))
    const pushItems = items => {
      if (items) {
        player.interactionHistory.push(...items.result)
        totalItems.value = items.total
      }
    }
    function setLoading(value) {
      player.loadings[CallApiKey.interactionHistory] = value
    }
    return {
      loading,
      setLoading,
      showEmptyState,
      CallApiKey,
      COLORS,
      player,
      utcToZonedTime,
      timeZone,
      format,
      pushItems,
      totalItems,
      formatDate,
      getColor,
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
