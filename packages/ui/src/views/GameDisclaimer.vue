<template>
  <MainLayout>
    <template v-slot:main>
      <div class="disclaimer">
        <p class="title">DISCLAIMER</p>
        <p class="text">
          <span class="bold">Remember:</span>
        </p>
        <router-link to="/scan" class="link">
          <CustomButton class="btn" type="primary"> CONTINUE </CustomButton>
        </router-link>
      </div>
    </template>
  </MainLayout>
</template>

<style lang="scss" scoped>
.disclaimer {
  text-align: center;
  display: grid;
  row-gap: 24px;
  margin-top: 10vh;
  .btn {
    width: max-content;
  }
}
</style>
