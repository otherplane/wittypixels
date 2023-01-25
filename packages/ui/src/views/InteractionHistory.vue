<template>
  <MainLayout :padding="true">
    <template v-slot:main>
      <div class="container">
        <SectionHeader title="Interactions history" />
        <div
          v-for="(interaction, index) in player.history"
          :key="interaction.timestamp"
          class="interaction-container"
          :class="{ even: index % 2 }"
        >
          <p class="interaction-label date">
            {{ formatDate(interaction.timestamp) }}
          </p>
          <p>
            <span class="highlight">{{ interaction.from }}</span>
            sent <span class="highlight">{{ interaction.points }}</span> px to
            <span class="highlight">{{ interaction.to }}</span>
          </p>
        </div>
        <CustomInfiniteLoading
          :getItems="player.getInteractionHistory"
          :list="player.history || []"
          :total="totalItems"
          @result="pushItems"
        />
      </div>
    </template>
  </MainLayout>
</template>
<script>
import { useStore } from '@/stores/player'
import { ref } from 'vue'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { formatDate } from '@/utils'
export default {
  setup() {
    const player = useStore()
    const timeZone = 'America/Denver'
    const totalItems = ref(0)
    const pushItems = items => {
      if (items) {
        player.history.push(...items.result)
        totalItems.value = items.total
      }
    }
    return {
      player,
      utcToZonedTime,
      timeZone,
      format,
      pushItems,
      totalItems,
      formatDate,
    }
  },
}
</script>
<style lang="scss" scoped>
.even {
  background: $transparent-lightgrey;
  border-radius: 4px;
}
.container {
  row-gap: 0px;
}
.interaction-container {
  padding: 16px;
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-template-rows: max-content;
  column-gap: 24px;
  text-align: left;
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
