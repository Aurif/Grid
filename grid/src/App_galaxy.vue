<script lang="ts" setup>
  import { determinePositioning } from '@/content/input/positioning'
  import GalaxyRenderer from '@/content/view/galaxy/GalaxyRenderer.vue'
  import InputGlobalRenderer from '@/content/view/InputGlobalRenderer.vue'
  import { ref } from 'vue'

  const _ = determinePositioning(ref(window.document.body))
</script>

<template>
  <GalaxyRenderer />
  <InputGlobalRenderer :rows="_.rows" />
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
