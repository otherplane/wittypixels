<template>
  <div class="marquee">
    <div class="marquee__inner" aria-hidden="true">
      <p
        v-for="(item, index) in new Array(20)"
        :key="index"
        class="marquee-elm"
      >
        <span>Created by the team behind the</span>
        <SvgImage class="logo" :svg="witnetLogo" />
        <span>decentralized oracle /</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import witnetLogo from '@/assets/witnet-logo.svg?raw'
export default {
  setup() {
    return { witnetLogo }
  },
}
</script>

<style scoped lang="scss">
.marquee {
  max-width: 100vw;
  position: relative;
  overflow: hidden;
  background: $black;
  color: $white;
  font-weight: lighter;
  padding: 4px;

  --offset: 20vw;
  --move-initial: calc(-25% + var(--offset));
  --move-final: calc(-50% + var(--offset));
}

.marquee__inner {
  width: fit-content;
  display: flex;
  position: relative;
  transform: translate3d(var(--move-initial), 0, 0);
  animation: marquee 50s linear infinite;
  .marquee-elm {
    display: grid;
    grid-template-columns: max-content max-content max-content;

    .logo {
      height: 20px;
      padding: 0 4px;
      position: inline-block;
    }
  }

  /* animation-play-state: paused; */
}

.marquee span {
  font-size: 0.875rem;
  margin: 0 0.2rem;
}

/* .marquee:hover .marquee__inner {
  animation-play-state: running;
} */

@keyframes marquee {
  0% {
    transform: translate3d(var(--move-initial), 0, 0);
  }

  100% {
    transform: translate3d(var(--move-final), 0, 0);
  }
}
</style>
