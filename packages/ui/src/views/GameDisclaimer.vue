<template>
  <MainLayout :hideNavBar="true">
    <template v-slot:main>
      <div class="view-container disclaimer">
        <SectionHeader title="Disclaimer" />
        <p class="text">
          <span class="bold">Remember:</span>
          once you scan your QR code, it will be forever linked to this web
          browser and the code will not work in a different browser.
        </p>
        <p class="long-text">
          You are highly encouraged to export your profile from the main screen
          of the game as backup, or in case that you need to move your profile
          into a different browser.
        </p>
      </div>
    </template>
    <template v-slot:bottom>
      <router-link to="/scan" class="link">
        <CustomButton class="btn" type="primary"> Continue </CustomButton>
      </router-link>
    </template>
  </MainLayout>
</template>

<style lang="scss" scoped>
.disclaimer {
  display: grid;
  row-gap: 16px;
}
</style>
