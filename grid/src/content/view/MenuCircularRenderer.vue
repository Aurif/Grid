<script lang="ts" setup>
  import mousePosition from '@/content/input/mouse-position'
  import { computed, ref } from 'vue'

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

  const svg = ref<SVGElement>()
  const { x, y } = mousePosition()
  const highlightedSegment = computed(() => {
    if (!svg.value) return
    const rect = svg.value.getBoundingClientRect()
    const elX = rect.left + rect.width / 2
    const elY = rect.top + rect.height / 2

    const angle = Math.atan2(elX - x.value, -elY + y.value) + Math.PI
    return Math.round((angle / Math.PI / 2) * props.segments) % props.segments
  })
</script>

<template>
  <svg ref="svg" viewBox="0 0 100 100">
    <path
      v-for="i in segments"
      :class="{ active: highlightedSegment == i - 1 }"
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
