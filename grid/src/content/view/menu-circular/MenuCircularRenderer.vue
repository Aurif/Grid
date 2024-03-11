<script lang="ts" setup>
  import { ref } from 'vue'

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

  const arcs = ref<SVGPathElement[]>([])

  function segmentToArc(i: number): SVGPathElement {
    if (i < 0 || i >= props.segments) throw new Error(`Out of bounds (${i})`)
    return arcs.value[i]
  }

  defineExpose({ segmentToArc })
</script>

<template>
  <svg ref="svg" viewBox="0 0 100 100">
    <path
      v-for="i in segments"
      :ref="(el) => (arcs[i - 1] = el as SVGPathElement)"
      :d="makeArcPath(i - 1)"
    ></path>
  </svg>
</template>

<style scoped>
  svg {
    width: 100%;
    height: 100%;
  }

  path {
    stroke: #ffffff;
    opacity: 0.03;
    fill: transparent;
    stroke-width: 4px;
  }

  .active {
    opacity: 0.35;
  }
</style>
