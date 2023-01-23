<template>
  <MainLayout :hideNavBar="true">
    <template v-slot:main>
      <div class="cover">
        <h2 class="title">
          Participate in the biggest collaborative act of NFT creation to date!
        </h2>
        <div class="background" />
      </div>
    </template>
    <template v-slot:bottom>
      <router-link to="/disclaimer">
        <CustomButton type="primary"> PLAY NOW </CustomButton>
      </router-link>
    </template>
  </MainLayout>
</template>

<script lang="ts">
import playerMainImage from '@/assets/grid.svg?raw'
export default {
  setup() {
    return { playerMainImage }
  },
}
</script>

<style lang="scss" scoped>
.cover {
  height: 90vh;
  width: 100%;
  overflow: hidden;
  .title {
    padding-bottom: 16px;
  }
  .background {
    width: 100%;
    border-top: 2px solid $black;
    background-image: url(../assets/grid.svg);
    background-position: center;
    background-size: cover;
    height: 100%;
  }
}
@media (max-width: 600px) {
  .cover {
    .title {
      padding: 0 16px 16px 16px;
    }
  }
}
</style>
