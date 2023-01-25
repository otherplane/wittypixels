<template>
  <div class="info">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.info {
  background-color: $transparent-black;
  border-radius: 24px;
  width: max-content;
  color: $white;
  font-weight: bold;
  font-size: 12px;
  padding: 4px 16px;
}
</style>
