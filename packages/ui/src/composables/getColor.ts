import { COLORS } from '@/constants'
import { computed } from 'vue'
import { useStore } from '@/stores/player'

export function getColor() {
  const playerColor = computed(() => useStore().color)

  return COLORS[playerColor.value]
}
