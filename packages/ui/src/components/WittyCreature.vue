<template>
  <div v-html="creaturePreview" ref="creature" class="creature"></div>
</template>

<script>
export default {
  props: {
    creaturePreview: String,
  },
}
</script>
