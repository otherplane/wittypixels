<template>
  <div
    class="players-container"
    :class="{ border }"
    :style="{ 'border-color': color }"
  >
    <ColorContainer :color="color">
      <p class="item player-name">{{ position }}</p>
    </ColorContainer>
    <p class="item player-name">{{ name }}</p>
    <p class="item player-score">{{ score }}px</p>
  </div>
</template>

<script>
export default {
  props: {
    index: Number,
    name: String,
    score: Number,
    position: Number,
    color: String,
    border: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped lang="scss">
.players-container {
  display: grid;
  grid-template-columns: 100px 1fr 1fr;
  align-items: center;
  row-gap: 16px;
  column-gap: 16px;
  padding: 16px;
  .player-name {
    color: var(--primary-color);
    justify-self: flex-start;
  }
  .player-score {
    justify-self: flex-end;
  }
}
.border {
  margin-top: 8px;
  border-width: 2px !important;
  border-radius: 8px;
}
</style>
