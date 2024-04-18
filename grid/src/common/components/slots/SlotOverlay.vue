<template>
  <div class="slot-overlay">
    <slot name="base"></slot>
    <div class="slot-overlay__overlay">
      <slot name="newer"></slot>
    </div>
  </div>
</template>

<style scoped>
  .slot-overlay {
    position: relative;
    width: 100%;
    height: 100%;

    &__overlay {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
  }
</style>
