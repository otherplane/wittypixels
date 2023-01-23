<template>
  <InfiniteLoading class="infinite-scroll bold" @infinite="load" />
</template>

<script>
import { computed, ref, onBeforeMount } from 'vue'
export default {
  props: {
    list: {
      type: Array,
      required: true,
    },
    filter: {
      type: String,
      default: null,
    },
    total: {
      type: Number,
      required: true,
    },
    getItems: {
      type: Function,
      required: true,
    },
  },
  emits: ['result'],
  setup(props, { emit }) {
    const currentPage = ref(0)
    const limit = ref(10)
    const offset = computed(() => {
      return limit.value * currentPage.value
    })
    onBeforeMount(async () => {
      await props.getItems(offset.value, limit.value)
    })

    const load = async $state => {
      try {
        const request = await props.getItems(offset.value, limit.value)
        const requestData = props.filter ? request[props.filter] : request
        if (props.list.length >= requestData.total) {
          return $state.complete()
        }
        if (
          requestData.total < limit.value &&
          requestData.result.length !== props.total
        ) {
          emit('result', request)
          return $state.complete()
        }
        emit('result', request)
        $state.loaded()
        currentPage.value++
      } catch (error) {
        $state.error()
      }
    }

    return { load }
  },
}
</script>

<style lang="scss" scoped>
.infinite-scroll {
  display: flex;
  justify-content: center;
  margin-top: 8px;
  background-color: $black;
  color: $white;
  border-radius: 4px;
}
</style>
