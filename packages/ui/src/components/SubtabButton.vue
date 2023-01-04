<template>
  <button class="small-tab" :class="{ active }">
    {{ label }}
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
.small-tab {
  color: var(--primary-color);
  font-weight: bold;
  &.active {
    text-decoration: underline;
  }
}
</style>
