<script lang="ts" setup>
  const props = defineProps<{ segments: number }>()
  const r = 45

  function makeArcPath(i: number): string {
    function angleToPoint(angle: number): string {
      return `${50 + r * Math.sin(angle)} ${50 - r * Math.cos(angle)}`
    }

    const angleDeviation = Math.PI / props.segments / 10

    const angleStart = ((Math.PI * 2) / props.segments) * (i - 0.5) + angleDeviation
    const angleEnd = ((Math.PI * 2) / props.segments) * (i + 0.5) - angleDeviation
    return `M ${angleToPoint(angleStart)} A ${r} ${r} 0 ${angleEnd - angleStart <= Math.PI ? 0 : 1} 1 ${angleToPoint(angleEnd)}`
  }
</script>

<template>
  <svg viewBox="0 0 100 100">
    <path v-for="i in segments" :d="makeArcPath(i)"></path>
  </svg>
</template>

<style scoped>
  svg {
    width: 100%;
    height: 100%;
  }

  path {
    stroke: #ffffff;
    opacity: 0.45;
    fill: transparent;
    stroke-width: 4px;
  }
</style>
