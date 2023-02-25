import { COLORS } from '@/constants'
import { computed } from 'vue'
import { useStore } from '@/stores/player'
import { getRgbaColor, isNumber } from '@/utils'

export function getColor(
  color: number | null = null,
  shade: number | null = null
) {
  console.log(1)
  const store = useStore()
  console.log(2)
  const selectedShade = computed(() =>
    isNumber(shade) ? shade : store.selectedShade
  )
  console.log(3)
  const selectedColor = isNumber(color)
    ? COLORS[color]
    : COLORS[store.selectedColor]
  console.log(4)
  const shadeData = selectedColor
    ? selectedColor[selectedShade.value]
    : [255, 255, 255]
  console.log(5)
  return computed(() => getRgbaColor(shadeData[0], shadeData[1], shadeData[2]))
}
