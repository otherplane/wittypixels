<template>
  <button class="btn" :class="[type]">
    <slot class="btn-content"> </slot>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default',
    validator(value) {
      return ['primary', 'secondary', 'disable', 'dark'].includes(value)
    },
  },
})
</script>

<style scoped lang="scss">
.btn {
  width: 100%;
  color: $white;
  padding: 8px 16px;
  border-radius: 28px;
  font-weight: bold;
  &.primary {
    color: $white;
    background: var(--primary-color);
  }
  &.secondary {
    color: $white;
    background: var(--primary-color);
  }
  &.dark {
    color: $white;
    background: var(--secondary-color);
  }
  &.disable {
    opacity: 0.6;
    cursor: no-drop;
  }
}
</style>
