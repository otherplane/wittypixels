<template>
  <teleport to="body">
    <div
      v-if="showModal"
      class="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >

        <!-- Modal panel, show/hide based on modal state. -->
        <div
          v-if="showModal"
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
export default {
  name: 'ModalDialog',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  setup(props, ctx) {
    const showModal = ref(false)
    const modalRef = ref(null)
    watch(
      () => {
        return props.show
      },
      show => {
        showModal.value = show
      }
    )
    onClickOutside(modalRef, () => ctx.emit('close'), { event: 'mousedown' })
    return {
      showModal,
      modalRef,
    }
  },
}
</script>
