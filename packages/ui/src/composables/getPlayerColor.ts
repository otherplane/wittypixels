import { COLORS } from '@/constants'
import { computed } from 'vue'
import { useStore } from '@/stores/player'
import { getRgbaColor } from '@/utils'

export function getPlayerColor() {
  const playerColor = computed(() => useStore().color)
  const shadeData = computed(() => COLORS[playerColor.value][3])
  return computed(() =>
    getRgbaColor(shadeData.value[0], shadeData.value[1], shadeData.value[2])
  )
}
