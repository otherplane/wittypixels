<template>
  <div class="bg-beige px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <div class="sm:flex sm:items-start">
      <div
        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-beige sm:mx-0 sm:h-10 sm:w-10"
      >
        <WittyPixelsIcon />
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg leading-6 font-medium text-black" id="modal-title">
          How to buy the 1-of-1 canvas NFT
        </h3>
        <div class="mt-2">
          <p class="text-sm text-black mb-2">
            The WittyPixels 1-of-1canvas NFT can be purchased as an ERC-721 on
            Ethereum mainnet through a Dutch auction.
          </p>
          <p class="text-sm text-black mb-2">
            Half of the amount paid goes to the Ukraine Emergency Response Fund
            through TheGivingBlock, and the other half will go to the players,
            proportional to their share of $WPX (i.e. how many pixels they got
            in the final artwork).
          </p>
          <p class="text-sm text-black mb-2">
            The initial price is 100 $ETH, and it goes down by 0.5 $ETH every
            hour, until somebody buys it.
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-beige px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <button
      @click="$parent?.$emit('close')"
      type="button"
      class="mt-3 w-full inline-flex justify-center rounded-full border-primary shadow-sm px-4 py-2 bg-transparent text-base font-medium modal-text-2 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    >
      Close
    </button>
  </div>
</template>
