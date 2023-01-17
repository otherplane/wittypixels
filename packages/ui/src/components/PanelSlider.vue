<template>
  <transition name="slide">
    <div v-if="showPanel" class="slide-up">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    showPanel: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    return {}
  },
}
</script>

<style scoped lang="scss">
.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
  transform-origin: bottom;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
  transform-origin: bottom;
}

.slide-up {
  position: absolute;
  bottom: 0;
  z-index: 20;
  width: 100%;
  padding: 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: $white;
  border-top: 2px solid $grey;
  border-left: 2px solid $grey;
  border-right: 2px solid $grey;
}
</style>
