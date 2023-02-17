<template>
  <input
    class="input"
    v-model="localValue"
    :placeholder="`Type your ${label}`"
    :data-lpignore="true"
  />
</template>

<script>
import { useVModel } from '@vueuse/core'
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const localValue = useVModel(props, 'modelValue', emit)

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
