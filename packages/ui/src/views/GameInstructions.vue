<template>
  <MainLayout>
    <template v-slot:main>
      <div class="container">
        <SectionHeader title="INSTRUCTIONS" />
        <h2 class="title"></h2>
      </div>
    </template>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { importSvg } from '@/composables/importSvg.js'
import { onMounted } from 'vue'
export default {
  setup() {
    const player = useStore()
    onMounted(() => {
      player.getTheme()
    })
    return { player, importSvg }
  },
}
</script>

<style lang="scss" scoped>
.container {
  text-align: left;
  .title {
    font-size: 24px;
  }
  .text {
    font-size: 18px;
  }
  .table-title {
    color: var(--primary-color);
  }
  .list {
    list-style-type: circle;
    &::marker {
      color: var(--primary-color);
    }
  }
  .disclaimer {
    margin: 16px;
    padding: 16px;
    background-color: var(--primary-color-opacity-1);
    border-radius: 4px;
    color: var(--primary-color);
    text-align: center;
    line-height: 1.5;
    font-weight: bold;
  }
  .table {
    text-align: left;
    .col {
      padding-right: 16px;
      font-weight: 600;
    }
    .trait {
      padding-left: 8px;
    }
    .row {
      border-radius: 4px;
      margin-bottom: 8px;
      height: 68px;
    }
    .icon {
      width: 40px;
    }
  }
  .link {
    color: var(--primary-color);
    text-decoration: underline;
    font-weight: bold;
  }
  .list-container {
    padding-left: 24px;
  }
}
</style>
