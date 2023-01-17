<template>
  <router-view />
  <GameNotification />
</template>

<style lang="scss">
#app {
  font-family: Lexend, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: grid;
  grid-template-rows: max-content 1fr;
  height: 100vh;
  overflow: hidden;
}
</style>
