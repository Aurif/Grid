<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';
    
    let uid: string = uuidv4()
    const props = defineProps<{ minDistance: number }>()

    const positions = ref<{[id: string]: {degree: number, layer: number}}>({})
    const maxLayer = computed(() => {
        return Math.max(...Object.values(positions.value).map(x => x.layer))
    })

    
    function elementToId(target: HTMLElement): string | undefined {
        let realTarget = target.closest('*[container-uid]')
        if (!realTarget || realTarget.getAttribute("container-uid") != uid) return
        let nodeId = realTarget.getAttribute("node-id")
        return nodeId || undefined
    }

    defineExpose({positions: () => positions, elementToId})

</script>

<template>
    <div :style="{'--layer-size': `calc((50vmin - ${props.minDistance}px)/${maxLayer+1})`}">
        <svg v-for="pos, id in positions" :key="id" 
            :style="{transform: `rotate(${pos.degree}deg) translateY(calc(${-props.minDistance}px - var(--layer-size) * ${pos.layer}))`}"
            :container-uid="uid" :node-id="id"
            viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="50" cy="50" r="40" />       
        </svg>
    </div>
</template>

<style scoped>
    svg {
        width: 16px;
        position: absolute;
        left: 50%;
        top: 50%;
    }

    circle {
        fill: transparent;
        stroke: white;
        stroke-width: 8px;
    }
</style>
