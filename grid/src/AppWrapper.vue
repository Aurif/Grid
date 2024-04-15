<script lang="ts" setup>
  import App from '@/App.vue';

  const inframe = window.self !== window.top
  if (inframe) window.document.body.classList.add('hidden')
</script>

<template>
  <div :class="{ 'pre-background': true, inframe: inframe }"></div>
  <div :class="{ background: true, inframe: inframe }"></div>
  <div class="inner">
    <Suspense>
      <App />
      <template #fallback>
        <div class="loading">Loading...</div>
      </template>
    </Suspense>
  </div>
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

  .pre-background:not(.inframe) {
    background-image: url('background.png');
    background-size: cover;
    background-position-x: 50%;
  }

  .background, .pre-background {
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: -999;
  }

  .background {
    background-color: #000000aa;
    backdrop-filter: blur(20px);
    transition:
      background-color 1s,
      backdrop-filter 1s;
  }

  .hidden .background.inframe {
    background-color: transparent;
    backdrop-filter: blur(0px);
  }

  .hidden .inner {
    opacity: 0;
  }

  .inner {
    height: 100%;
    width: 100%;
    transition: opacity 0.5s;
  }
</style>