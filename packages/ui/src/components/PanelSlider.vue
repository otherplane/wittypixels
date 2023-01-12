<template>
  <transition name="slide-up">
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
.slide-in-enter-active {
  transition-duration: 0.2s;
  transition-timing-function: ease-in;
}

.slide-in-leave-active {
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-in-enter-to,
.slide-leave {
  opacity: 1;
}

.slide-in-enter,
.slide-in-leave-to {
  opacity: 0;
}

.slide-up {
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
