<script setup lang="ts">
import { determinePositioning } from '@/content/input/positioning';
import GalaxyRenderer from '@/content/view/galaxy/GalaxyRenderer.vue';
import InputRenderer from '@/content/view/InputRenderer.vue';

  const _ = determinePositioning()
</script>

<template>
  <GalaxyRenderer/>
  <InputRenderer :rows="_.rows"/>
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
