<script setup lang="ts">
    import { ref, watch } from 'vue'
    import GridUpdater from './grid-updater';

    const props = defineProps<{
        rows: number, 
        columns: number, 
        bind?: GridUpdater
    }>()

    const chars = ref<{[id: string]: HTMLSpanElement}>({})
    props.bind?.bind((x, y) => {
        if (x < 0 || x >= props.columns || y < 0 || y >= props.rows) throw new Error(`Out of bounds (${x}, ${y})`);
        return chars.value[x+':'+y]
    })

    let stateId = 0
    watch(() => [props.rows, props.columns], () => {stateId++})

    function randomChar() {
        let charset = 'ABCDEFGHIJKLMNOPRSTUVWXYZ#%:+1234567890'.split('');
        return charset[Math.floor(Math.random() * charset.length)];
    }
</script>

<template>
    <div class="parent">
        <div class="row" v-for="y in rows*1">
            <span v-for="x in columns*1" :key="stateId+':'+(x-1)+':'+(y-1)" :ref="(el) => chars[(x-1)+':'+(y-1)]=(el as HTMLSpanElement)">
                {{ randomChar() }}
            </span>
        </div>
    </div>
</template>

<style scoped>
    .parent {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 100%;
    }
    .row {
        display: flex;
        justify-content: space-evenly;
    }
    span {
        color: #ffffff;
        font-size: 30px;
        font-family: 'Roboto Mono', monospace;
        opacity: 0.1;
        user-select: none;
        width: 16px;
    }
    span.active {
        opacity: 1;
        color: #eee683;
        text-shadow: 0 0 4px #eee683;
    }
</style>
