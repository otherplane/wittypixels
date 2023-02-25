import { COLORS } from '@/constants'
import { computed } from 'vue'
import { useStore } from '@/stores/player'
import { getRgbaColor, isNumber } from '@/utils'

export function getColor(
  color: number | null = null,
  shade: number | null = null
) {
  const store = useStore()
  const selectedShade = computed(() =>
    isNumber(shade) ? shade : store.selectedShade
  )
  const selectedColor = isNumber(color)
    ? COLORS[color]
    : COLORS[store.selectedColor]
  const shadeData = selectedColor
    ? selectedColor[selectedShade.value]
    : [255, 255, 255]
  return computed(() => getRgbaColor(shadeData[0], shadeData[1], shadeData[2]))
}
