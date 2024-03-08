<script setup lang="ts">

import { ref } from 'vue';
import PageGrid from './pages/PageGrid.vue';

  const _ = {pageControl: ref(false)}

</script>

<template>
  <PageGrid v-if="!_.pageControl.value" :pageControl="_.pageControl" />
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