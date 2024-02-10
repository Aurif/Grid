<script setup lang="ts">
import GridRenderer from './renderer/GridRenderer.vue'
import InputRenderer from './renderer/InputRenderer.vue'

import { determinePositioning } from './renderer/positioning'
const { rows, columns } = determinePositioning()
</script>

<template>
  <GridRenderer :rows="rows" :columns="columns"/>
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
