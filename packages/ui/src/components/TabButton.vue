<template>
  <button class="tab" :class="{ active }">
    {{ label.toUpperCase() }}
  </button>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped lang="scss">
.tab {
  width: 100%;
  color: var(--primary-color);
  padding: 4px 8px;
  background: $white;
  border-radius: 4px;
  font-weight: bold;
  &.active {
    background: var(--primary-color);
    color: $white;
  }
}
</style>
