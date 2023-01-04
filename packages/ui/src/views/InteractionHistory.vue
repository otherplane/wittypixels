<template>
  <MainLayout>
    <div class="container">
      <SectionHeader title="HISTORY" />
      <div
        v-for="(interaction, index) in player.history?.interactions"
        :key="interaction.timestamp"
        class="interaction-container"
        :class="{ even: index % 2 }"
      >
        <p class="interaction-label date">
          {{
            format(
              utcToZonedTime(interaction.timestamp, timeZone),
              'yyyy-MM-dd HH:mm:ss'
            )
          }}
        </p>
        <p>
          <span class="highlight">{{ interaction.from }}</span>
          sent <span class="highlight">{{ interaction.points }}</span> points to
          <span class="highlight">{{ interaction.to }}</span>
        </p>
      </div>
      <CustomPagination
        v-if="numberPages > 1"
        :limit="numberPages"
        @update-page="updateCurrentPage"
      />
    </div>
  </MainLayout>
</template>
<script>
import { useStore } from '@/stores/player'
import { onMounted, computed, ref, watch } from 'vue'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
export default {
  setup() {
    const player = useStore()
    const timeZone = 'America/Denver'
    onMounted(() => {
      player.getInteractionHistory()
    })
    const currentPage = ref(0)
    const limit = ref(25)
    const numberPages = computed(() => {
      return Math.ceil((player.history?.total || 0) / limit.value)
    })
    const offset = computed(() => {
      return limit.value * currentPage.value
    })
    watch(currentPage, async () => {
      await player.getInteractionHistory(offset.value, limit.value)
    })
    function updateCurrentPage(page) {
      currentPage.value = page
    }
    return {
      player,
      utcToZonedTime,
      timeZone,
      format,
      numberPages,
      updateCurrentPage,
    }
  },
}
</script>
<style lang="scss" scoped>
.even {
  background: var(--primary-color-opacity-2);
  border-radius: 4px;
}
.container {
  row-gap: 0px;
}
.interaction-container {
  padding: 16px;
  display: grid;
  grid-template-columns: max-content 1fr;
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
.date {
  width: max-content;
  font-size: 218x;
}
</style>
