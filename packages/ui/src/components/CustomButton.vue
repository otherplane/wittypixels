<template>
  <button class="btn" :class="[type]">
    <slot class="btn-content"> </slot>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'primary',
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
    transition: all 0.3s;
    color: $white;
    background: var(--primary-color);
  }
  &.secondary {
    transition: all 0.3s;
    color: $white;
    background: var(--primary-color);
  }
  &.dark {
    transition: all 0.3s;
    color: $white;
    background: var(--secondary-color);
  }
  &.disable {
    transition: all 0.3s;
    background: $grey;
    cursor: no-drop;
  }
}
</style>
