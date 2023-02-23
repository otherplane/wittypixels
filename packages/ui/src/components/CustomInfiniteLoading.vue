<template>
  <InfiniteLoading class="infinite-scroll bold" @infinite="load" />
</template>

<script>
import { computed, ref, onBeforeMount } from 'vue'
import { PAGINATION_LIMIT } from '@/constants'
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
  emits: ['result', 'loading'],
  setup(props, { emit }) {
    const currentPage = ref(0)
    const offset = computed(() => {
      return PAGINATION_LIMIT * currentPage.value
    })

    onBeforeMount(() => emit('loading', true))

    const load = async $state => {
      try {
        const request = await props.getItems(offset.value, PAGINATION_LIMIT)
        const requestData = props.filter ? request[props.filter] : request
        if (props.list.length >= requestData.total) {
          return $state.complete()
        }
        if (
          requestData.total < PAGINATION_LIMIT &&
          requestData.result.length !== props.total
        ) {
          emit('loading', false)
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
  background-color: $white;
  color: $white;
  border-radius: 4px;
}
</style>
