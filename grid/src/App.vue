<script setup lang="ts">
  import { determinePositioning } from './input/positioning'
  import GalaxyRenderer from './view/GalaxyRenderer.vue';
  import InputRenderer from './view/InputRenderer.vue'
  const { rows } = determinePositioning()
</script>

<template>
  <GalaxyRenderer/>
  <InputRenderer :rows="rows"/>
</template>

<style>
  body {
    background-color: #181818;
    margin: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  #app {
    height: 100%;
    width: 100%;
  }
</style>
