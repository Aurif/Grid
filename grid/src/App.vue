<script lang="ts" setup>
  import PageGrid from '@/pages/PageGrid.vue'
  import PageYggdrasil from '@/pages/PageYggdrasil.vue'
  import { ref } from 'vue'

  const _ = { pageControl: ref(false) }
</script>

<template>
  <PageGrid v-if="!_.pageControl.value" :pageControl="_.pageControl" />
  <PageYggdrasil v-if="_.pageControl.value" :pageControl="_.pageControl" />
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

  div,
  input,
  span {
    text-transform: uppercase;
    font-family: 'Roboto Mono', monospace;
  }
</style>
