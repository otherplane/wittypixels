<template>
  <MainLayout>
    <div class="container">
      <SectionHeader title="LEADERBOARD" />
      <div class="tabs-container">
        <div v-for="tab in Object.values(tabs)" :key="tab.key">
          <TabButton
            :active="tab.active"
            :label="tab.key"
            @click="activateTab({ primaryValue: tab.key })"
          />
        </div>
      </div>
      <div class="subtabs-container" v-if="tabs[primaryTab].showSubtabs">
        <div
          v-for="tab in Object.values(tabs[primaryTab].subTabs)"
          :key="tab.key"
          class="tab"
        >
          <SubtabButton
            :active="tab.active"
            :label="tab.key"
            @click="
              activateTab({ primaryValue: primaryTab, secondaryValue: tab.key })
            "
          />
        </div>
      </div>
      <ListStats :gameEntity="primaryTab" :entityAttribute="secondaryTab" />
    </div>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { onMounted, ref, computed, onBeforeUnmount } from 'vue'
import { STATS_FILTERS } from '../constants'
export default {
  setup() {
    const player = useStore()
    let primaryTab = ref('players')
    let secondaryTab = ref('overall')
    let tabs = ref(STATS_FILTERS)
    let defaultSubTab = computed(() => tabs.value[primaryTab.value].default)
    onMounted(() => {
      tabs.value[primaryTab.value].active = true
      tabs.value[primaryTab.value].subTabs[secondaryTab.value].active = true
    })
    onBeforeUnmount(() => {
      resetTabs()
    })
    const resetTabs = () => {
      tabs.value[primaryTab.value].active = false
      tabs.value[primaryTab.value].subTabs[secondaryTab.value].active = false
    }
    const stats = {}
    const activateTab = ({ primaryValue, secondaryValue }) => {
      resetTabs()
      primaryTab.value = primaryValue
      tabs.value[primaryTab.value].active = true
      secondaryTab.value = secondaryValue || defaultSubTab.value
      tabs.value[primaryTab.value].subTabs[
        secondaryValue || defaultSubTab.value
      ].active = true
    }
    return { player, activateTab, tabs, primaryTab, secondaryTab, stats }
  },
}
</script>

<style lang="scss" scoped>
.tabs-container {
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-gap: 8px;
  justify-content: center;
}
.subtabs-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .tab {
    margin: 4px 8px;
  }
}
</style>
