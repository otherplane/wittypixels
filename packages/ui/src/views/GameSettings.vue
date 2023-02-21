<template>
  <MainLayout :hideNavBar="fromAuth">
    <template v-slot:main>
      <div class="container">
        <SectionHeader title="Settings" />
        <label class="form-label">Name</label>
        <CustomInput
          class="field"
          type="text"
          label="name"
          v-model="username"
        />
        <SectionHeader title="Instructions" />
        <p class="instructions-title red">
          1. Join the Eth Denver oficial game
        </p>
        <p class="paragraph">
          Join the official game of EthDenver by visiting the Witnet +
          WittyPixels booth at the registration area. Receive a limited edition
          player palette pendant and scan the QR code on it with wittypixels.art
          on your phone. The first person to scan it will own it!
        </p>
        <p class="instructions-title orange">
          2. Get your palette scan by others
        </p>
        <p class="paragraph">
          Earn pixels of distinct colors by getting the QR code on your palette
          scanned by players with different palette colors. Here are some rules:
        </p>
        <ul class="list-container">
          <li class="list">
            There are 6 different palette colors: <span class="red">Red</span>,
            <span class="orange">Orange</span>,
            <span class="yellow">Yellow</span>,
            <span class="green">Green</span>, <span class="blue">Blue</span> and
            <span class="purple">Purple</span>.
          </li>
          <li class="list">
            Scanning someone for the 1st time gives 10px, 2nd time is 5px, then
            3px, 2px, and 1px. Make sure to scan new players all the time!
          </li>
          <li class="list">You can only scan or be scanned every 2 minutes.</li>
          <li class="list">
            The same 2 players can only repeat scanning every 30 minutes.
          </li>
        </ul>
        <p class="instructions-title green">
          3. Place your pixels into the canvas
        </p>
        <p class="paragraph">
          Place pixels of different colors into the shared virtual canvas to
          create a masterpiece together with other players. You can pick lighter
          and darker shades for more creative control.
        </p>
        <p class="instructions-title blue">4. Seek the bonuses</p>
        <p class="paragraph">
          Try to spot the bonus QR codes located across the venue and at
          sponsors booths. Every time you scan a new bonus, any further scan is
          worth 2x the pixels for 15 minutes!
        </p>
        <p class="instructions-title purple">
          5. Turn your pixels into NFT fractions
        </p>
        <p class="paragraph">
          On March 5, a snapshot of the canvas will be minted as a single
          ERC-721 NFT, and fractions of it will be distributed to the players as
          an ERC-20 named $WPX. The more pixels you get into the final artwork,
          the more $WPX fractions you will own!
        </p>
        <p class="instructions-title red">6. Witness a historic NFT auction</p>
        <p class="paragraph">
          After minting, the fractionalized NFT will be sold at a public Dutch
          auction, where one "patron" will be able to purchase the canvas NFT
          and own this one-of-a-kind piece of crypto history. 50% of the
          proceeds from the auction will be donated to TheGivingBlock's Ukraine
          Emergency Response Fund, while the other 50% will be distributed to
          players proportionally to the $WPX fractions they hold. So not only
          will you have fun and network with others, but you may also go home
          with extra $ETH in your wallet!
        </p>
        <p class="instructions-title orange">
          7. Swap your $WPX for real $ETH!
        </p>
        <p class="paragraph">
          50% of the $ETH from the auction will be donated to TheGivingBlock's
          Ukraine Emergency Response Fund. The other 50% will be distributed to
          the players proportionally to the $WPX fractions they hold. That is,
          on top of the fun and the networking, you may go back home with some
          extra $ETH in your wallet!
        </p>
        <p class="instructions-title green">8. Go down the Witnet rabbithole</p>
        <p class="paragraph">
          The fractionalization of the WittyPixels NFT will be powered and
          secured by Witnet — the Multichain Decentralized oracle that makes the
          most of its native $WIT coin to feed reliable data and randomness to
          an ever increasing list of Web3 projects across the 45+ chains it
          supports. For more info, check out the back side of this leaflet!
        </p>
      </div>
    </template>
    <template v-slot:bottom>
      <router-link v-if="fromAuth" to="/">
        <CustomButton type="secondary" :slim="true"> Continue</CustomButton>
      </router-link>
    </template>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { ref, computed } from 'vue'
import router from '../router'
import { importSvg } from '@/composables/importSvg.js'

import debounce from 'lodash.debounce'

export default {
  setup() {
    const player = useStore()
    const updateName = debounce(val => {
      if (val !== player.username) {
        player.updateName({ name: val })
      }
    }, 1200)
    const username = computed({
      get() {
        return player.username
      },
      set: updateName,
    })

    const fromAuth = ref(!!router.currentRoute.value.params?.id)
    return { player, importSvg, fromAuth, username }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 16px;
  text-align: left;
  font-size: 18px;
  .instructions-title {
    font-weight: bold;
    font-size: 18px;
    margin-top: 16px;
    margin-bottom: 8px;
  }
  .list {
    list-style-type: square;
    color: $black;
    &::marker {
      color: var(--primary-color);
    }
  }
  .paragraph {
    color: $black;
    margin-bottom: 8px;
  }
  .field {
    margin-bottom: 24px;
  }
  .link {
    color: var(--primary-color);
    text-decoration: underline;
    font-weight: bold;
  }
  .list-container {
    padding-left: 24px;
  }
}
</style>
