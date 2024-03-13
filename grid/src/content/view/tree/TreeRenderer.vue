<script lang="ts" setup>
  import LineRendering from '@/content/view/tree/composables/line-rendering'
  import { v4 as uuidv4 } from 'uuid'
  import { computed, ref } from 'vue'

  let uid: string = uuidv4()
  const props = defineProps<{ minDistance: number }>()

  const svg = ref<HTMLElement>()
  const nodes = ref<{ [id: string]: SVGElement }>({})
  const lines = ref<{ [id: string]: SVGElement }>({})

  const positions = ref<{ [id: string]: { degree: number; layer: number; parent?: string } }>({})
  const maxLayer = computed(() => {
    return Math.max(...Object.values(positions.value).map((x) => x.layer))
  })

  const linePos = new LineRendering(svg, nodes, positions, props.minDistance).linePositions

  function elementToId(target: HTMLElement): string | undefined {
    let realTarget = target.closest('*[container-uid]')
    if (!realTarget || realTarget.getAttribute('container-uid') != uid) return
    let nodeId = realTarget.getAttribute('node-id')
    return nodeId || undefined
  }

  function idToElement(nodeId: string): SVGElement | undefined {
    return nodes.value[nodeId]
  }

  function idToLineElement(nodeId: string): SVGElement | undefined {
    return lines.value[nodeId]
  }

  defineExpose({ positions: () => positions, elementToId, idToElement, idToLineElement })
</script>

<template>
  <svg
    ref="svg"
    :style="{ '--layer-size': `calc((50vmin - ${props.minDistance + 8}px)/${maxLayer + 1})` }"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g v-for="(pos, id) in positions" :key="id">
      <circle
        :ref="(el) => (nodes[id] = el as SVGElement)"
        :container-uid="uid"
        :node-id="id"
        :style="{
          transform: `rotate(${pos.degree}deg) translateY(calc(${-props.minDistance - 8}px - var(--layer-size) * ${pos.layer}))`
        }"
        cx="50%"
        cy="50%"
        r="7"
      />
      <line
        :ref="(el) => (lines[id] = el as SVGElement)"
        :x1="linePos[id].x1"
        :x2="linePos[id].x2"
        :y1="linePos[id].y1"
        :y2="linePos[id].y2"
      />
    </g>
  </svg>
</template>

<style scoped>
  svg {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  circle {
    fill: transparent;
    transform-origin: 50% 50%;
    opacity: 0.45;
  }

  circle,
  line {
    stroke-width: 2px;
    stroke: white;
  }

  line {
    opacity: 0.15;
  }

  circle.active {
    opacity: 1;
    stroke-width: 3px;
  }

  circle[nodeStyle='dashed'] {
    stroke-dasharray: 3.55;
  }

  circle[nodeStyle='glow'] {
    opacity: 0.8;
  }

  circle[nodeStyle='glow'] ~ line {
    opacity: 0.35;
  }

  circle[nodeStyle='glow'].active {
    opacity: 1;
  }
</style>
