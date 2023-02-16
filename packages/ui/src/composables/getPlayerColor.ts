import { COLORS } from '@/constants'
import { computed } from 'vue'
import { useStore } from '@/stores/player'
import { getRgbaColor } from '@/utils'

export function getPlayerColor() {
  const playerColor = computed(() => useStore().color)
  const shadeData = COLORS[playerColor.value][3]
  return computed(() => getRgbaColor(shadeData[0], shadeData[1], shadeData[2]))
}
