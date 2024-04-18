<script lang="ts" setup>
  import ConstantFocusField from '@/common/components/ConstantFocusField.vue'
  import { computed, type Ref } from 'vue'

  const emit = defineEmits(['newEntry'])
  let props = defineProps<{
    rows: Ref<number>
  }>()
  let inputHeight = computed(
    () => (window.innerHeight / props.rows.value) * (props.rows.value % 2 ? 3 : 2)
  )
</script>

<template>
  <div class="wrapper">
    <ConstantFocusField
      :required="true"
      :style="{ '--input-font-size': inputHeight + 'px' }"
      @on-input="emit('newEntry', $event)"
    />
  </div>
</template>

<style scoped>
  :deep(input) {
    position: absolute;
    left: 0;
    width: 100%;
    top: calc(50% - var(--input-font-size) / 2);
    height: var(--input-font-size);
    font-size: var(--input-font-size);
    border: none;
    outline: none;
    color: #fffcf6;
    caret-color: #fff2d3;
    text-align: center;
    transition: background-color 0.5s;
    background-color: #181818;
  }

  :deep(input:invalid) {
    caret-color: transparent;
    color: transparent;
    background-color: transparent;
    cursor: default;
    pointer-events: none;
  }
</style>
