<template>
  <transition name="slide">
    <div v-if="toggle" class="notification">
      <p class="message">
        {{ message }}
      </p>
      <!-- <p v-if="icon" class="warning">{{ icon }} ️</p> -->
    </div>
  </transition>
</template>

<script>
import { getCurrentInstance, onMounted, ref } from 'vue'
const ICONS = {
  warn: '⚠️️',
  party: '🎉',
  none: '',
}
export default {
  setup() {
    const toggle = ref(false)
    const message = ref('')
    const icon = ref('️')
    const counter = ref(0)

    const show = payload => {
      message.value = payload.message
      if (payload.icon !== 'none') {
        icon.value = ICONS[payload.icon] || ICONS['warn']
      }
      toggle.value = true
      counter.value += 1

      setTimeout(() => {
        counter.value -= 1
        toggle.value = counter.value !== 0
      }, 4000)
    }
    onMounted(() => {
      getCurrentInstance().appContext.config.globalProperties.$notify = show
    })
    return { toggle, message, counter, icon }
  },
}
</script>

<style lang="scss" scoped>
.slide-enter-active {
  transition-duration: 0.2s;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave {
  opacity: 1;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
}

.notification {
  z-index: 100;
  background-color: black;
  border-radius: 4px;
  top: 40px;
  display: flex;
  left: 0;
  margin-left: auto;
  margin-right: auto;
  position: fixed;
  right: 0;
  width: max-content;
  max-width: 250px;

  .warning {
    font-size: 24px;
    color: white;
    margin-right: 8px;
  }

  .message {
    color: white;
    font-size: 14px;
    padding: 8px 16px;
  }
}
</style>
