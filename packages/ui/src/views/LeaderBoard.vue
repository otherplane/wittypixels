<template>
  <MainLayout :padding="true">
    <template v-slot:main>
      <div class="container">
        <SectionHeader title="Leaderboard" />
        <ListStats :gameEntity="primaryTab" :entityAttribute="secondaryTab" />
      </div>
    </template>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { ref } from 'vue'
export default {
  setup() {
    const player = useStore()
    let primaryTab = ref('players')
    let secondaryTab = ref('overall')
    return { player, primaryTab, secondaryTab }
  },
}
</script>
