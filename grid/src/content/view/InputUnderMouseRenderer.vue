<script lang="ts" setup>
  import ConstantFocusField from '@/common/components/ConstantFocusField.vue'
  import mousePosition from '@/content/input/mouse-position'

  const emit = defineEmits(['onNewEntry'])
  const { x, y } = mousePosition()
</script>

<template>
  <div class="wrapper">
    <ConstantFocusField
      :required="true"
      :style="{ left: `calc(${x}px - 50vw)`, top: `calc(${y}px + 1em)` }"
      @on-input="emit('onNewEntry', $event)"
    />
  </div>
</template>

<style scoped>
  :deep(input) {
    position: fixed;
    left: 0;
    width: 100vw;
    top: calc(50% - var(--input-font-size) / 2);
    height: 1em;
    font-size: 1em;
    border: none;
    outline: none;
    color: #fffcf6;
    caret-color: #fff2d3;
    text-align: center;
    background-color: transparent;
    cursor: default;
    pointer-events: none;
  }

  :deep(input:invalid) {
    caret-color: transparent;
    color: transparent;
  }
</style>
