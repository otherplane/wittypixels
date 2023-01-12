<template>
  <MainLayout :isBackground="true">
    <template v-slot:main>
      <router-link to="/disclaimer" class="link">
        <CustomButton class="btn" type="primary"> PLAY NOW </CustomButton>
      </router-link>
    </template>
  </MainLayout>
</template>

<style lang="scss" scoped>
.link {
  margin-top: 40vh;
  width: max-content;
  justify-self: center;
}
</style>
