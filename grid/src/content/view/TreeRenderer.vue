<script setup lang="ts">
import { computed, ref } from 'vue';
    const props = defineProps<{ minDistance: number }>()

    const positions = ref<{degree: number, layer: number}[]>([])
    positions.value = [
        {degree: 0, layer: 0},
        {degree: 30, layer: 0},
        {degree: 60, layer: 0},
        {degree: 90, layer: 0},
        {degree: 0, layer: 2},
        {degree: 30, layer: 1},
        {degree: 60, layer: 1},
        {degree: 90, layer: 1},
        {degree: 0, layer: 3},
        {degree: 0, layer: 4},
    ]
    const maxLayer = computed(() => {
        return Math.max(...positions.value.map(x => x.layer))
    })

</script>

<template>
    <div :style="{'--layer-size': `calc((50vmin - ${props.minDistance}px)/${maxLayer+1})`}">
        <svg v-for="pos, i in positions" :key="i" 
            :style="{transform: `rotate(${pos.degree}deg) translateY(calc(${-props.minDistance}px - var(--layer-size) * ${pos.layer}))`}"
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
