<template>
  <input
    class="input"
    disabled
    v-model.lazy="localValue"
    :placeholder="`Type your ${label}`"
    :data-lpignore="true"
  />
</template>

<script>
import { useLocalValue } from '@/composables/localValueGetSet'
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
  },
  setup() {
    const { localValue } = useLocalValue()
    return { localValue }
  },
}
</script>

<style lang="scss" scoped>
.input {
  display: block;
  width: 100%;
  padding: 8px;
  color: $black;
  font-size: 18px;
  border: none;
  border-radius: 0;
  border-bottom: 2px solid $transparent-black;
  &:disabled {
    opacity: 0.5;
    background-color: $white;
    &:hover {
      cursor: no-drop;
    }
  }
  &::placeholder {
    font-size: 18px;
    color: $grey;
  }
  &:focus {
    outline: none;
    border-bottom: 3px solid $transparent-black;
  }
}
</style>
