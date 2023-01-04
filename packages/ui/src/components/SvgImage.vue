<template>
  <div v-html="svg" />
</template>

<script>
export default {
  props: {
    svg: { type: String, required: true },
  },
}
</script>

<style lang="scss">
.fill-primary {
  fill: var(--primary-color);
}
.stroke-primary {
  stroke: var(--primary-color);
}
</style>
