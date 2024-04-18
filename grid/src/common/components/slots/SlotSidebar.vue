<script lang="ts" setup></script>

<template>
  <div class="slot-sidebar">
    <div class="slot-sidebar__main">
      <slot name="base"></slot>
    </div>
    <div class="slot-sidebar__sidebar">
      <slot name="newer"></slot>
    </div>
  </div>
</template>

<style scoped>
  .slot-sidebar {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-areas: 'main right';
    grid-template-columns: auto 30em;

    &__main {
      grid-area: main;
    }

    &__sidebar {
      grid-area: right;
    }
  }
</style>
