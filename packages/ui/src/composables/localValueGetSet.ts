import { computed, getCurrentInstance } from 'vue'
export const useLocalValue = () => {
  const context = getCurrentInstance()
  const localValue = computed({
    get() {
      return context?.props.value
    },
    set(value) {
      context?.emit('change', {
        label: context.props.label,
        value: value,
      })
    },
  })
  return { localValue }
}
