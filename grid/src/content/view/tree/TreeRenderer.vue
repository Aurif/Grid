<script lang="ts" setup>
  import { v4 as uuidv4 } from 'uuid'
  import { computed, ref } from 'vue'

  let uid: string = uuidv4()
  const props = defineProps<{ minDistance: number }>()

  const positions = ref<{ [id: string]: { degree: number; layer: number } }>({})
  const maxLayer = computed(() => {
    return Math.max(...Object.values(positions.value).map((x) => x.layer))
  })
  const nodes = ref<{ [id: string]: HTMLElement }>({})

  function elementToId(target: HTMLElement): string | undefined {
    let realTarget = target.closest('*[container-uid]')
    if (!realTarget || realTarget.getAttribute('container-uid') != uid) return
    let nodeId = realTarget.getAttribute('node-id')
    return nodeId || undefined
  }

  function idToElement(nodeId: string): HTMLElement | undefined {
    return nodes.value[nodeId]
  }

  defineExpose({ positions: () => positions, elementToId, idToElement })
</script>

<template>
  <svg
    :style="{ '--layer-size': `calc((50vmin - ${props.minDistance}px)/${maxLayer + 1})` }"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      v-for="(pos, id) in positions"
      :key="id"
      :ref="(el) => (nodes[id] = el as HTMLElement)"
      :container-uid="uid"
      :node-id="id"
      :style="{
        transform: `rotate(${pos.degree}deg) translateY(calc(${-props.minDistance}px - var(--layer-size) * ${pos.layer}))`
      }"
      cx="50%"
      cy="50%"
      r="7"
    />
  </svg>
</template>

<style scoped>
  svg {
    left: calc(50% - 16px);
    top: calc(50% - 16px);
    width: 100%;
    height: 100%;
  }

  circle {
    fill: transparent;
    stroke: white;
    stroke-width: 2px;
    opacity: 0.45;
    transform-origin: 50% 50%;
  }

  .active {
    opacity: 1;
    stroke-width: 3px;
  }
</style>
