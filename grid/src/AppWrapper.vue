<script setup lang="ts">
  import App from '@/App.vue';
</script>

<template>
  <Suspense>
    <App />
    <template #fallback>
      <div class="loading">Loading...</div>
    </template>
  </Suspense>
</template>

<style scoped>
  .loading {
    height: 100vh;
    text-align: center;
    line-height: 100vh;
    font-size: 8vmin;
    text-shadow: 0 0 4px #2d2b39;
    color: #2d2b39;
  }
</style>
