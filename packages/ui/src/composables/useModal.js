import { ref } from 'vue'

export function useModal() {
  const show = ref(false)

  return {
    showModal() {
      show.value = true
    },
    hideModal() {
      show.value = false
    },
    visible: show,
  }
}
