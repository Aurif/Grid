<script setup lang="ts">
    import { ref } from 'vue'
    import GridUpdater from './grid-updater';

    const props = defineProps<{
        rows: number, 
        columns: number, 
        bind?: GridUpdater
    }>()

    const chars = ref<{[id: string]: HTMLSpanElement}>({})
    props.bind?.bind((x, y) => {
        if (x < 0 || x >= props.columns || y < 0 || y >= props.rows) throw new Error('Out of bounds');
        return chars.value[x+':'+y]
    })

    function randomChar() {
        let charset = 'ABCDEFGHIJKLMNOPRSTUVWXYZ#%:+1234567890';
        return charset.charAt(Math.floor(Math.random() * charset.length));
    }
</script>

<template>
    <div class="parent">
        <div class="row" v-for="y in rows*1">
            <span v-for="x in columns*1" :ref="(el) => chars[(x-1)+':'+(y-1)]=(el as HTMLSpanElement)">
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
</style>
