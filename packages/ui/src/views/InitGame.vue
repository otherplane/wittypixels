<template>
  <MainLayout :isBackground="true">
    <router-link to="/disclaimer" class="link">
      <CustomButton class="btn" type="primary"> PLAY NOW </CustomButton>
    </router-link>
  </MainLayout>
</template>

<style lang="scss" scoped>
.link {
  margin-top: 40vh;
  width: max-content;
  justify-self: center;
}
</style>
