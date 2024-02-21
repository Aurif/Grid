<script setup lang="ts">
    import { ref, watch } from 'vue'
    const props = defineProps<{
        rows: number, 
        columns: number
    }>()
    let uid = Date.now()

    const chars = ref<{[id: string]: HTMLSpanElement}>({})
    let stateId = 0
    watch(() => [props.rows, props.columns], () => {stateId++})

    function randomChar() {
        let charset = 'ABCDEFGHIJKLMNOPRSTUVWXYZ#%:+1234567890'.split('');
        return charset[Math.floor(Math.random() * charset.length)];
    }

    function posToChar(x: number, y: number): HTMLSpanElement {
        if (x < 0 || x >= props.columns || y < 0 || y >= props.rows) throw new Error(`Out of bounds (${x}, ${y})`);
        return chars.value[x+':'+y]
    }
    function spanToPos(span: HTMLElement): [number, number] | undefined {
        if (span.getAttribute("container-uid") != ''+uid) return
        let posX = span.getAttribute("pos-x")
        let posY = span.getAttribute("pos-y")
        if (posX == null || posY == null) throw new Error("Corrupted grid element "+span)
        return [parseInt(posX), parseInt(posY)]
    }
    defineExpose({posToChar, spanToPos})
</script>

<template>
    <div class="parent">
        <div class="row" v-for="y in rows*1">
            <span v-for="x in columns*1" :key="stateId+':'+(x-1)+':'+(y-1)" 
                  :ref="(el) => chars[(x-1)+':'+(y-1)]=(el as HTMLSpanElement)"
                  :container-uid="uid" :pos-x="x-1" :pos-y="y-1"
            >
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
        margin: 0 8px;
    }
    span {
        color: #ffffff;
        font-size: 30px;
        font-family: 'Roboto Mono', monospace;
        opacity: 0.1;
        user-select: none;
        width: 16px;
        flex-grow: 1;
        text-align: center;
    }
    span.active {
        opacity: 1;
        color: #eee683;
        text-shadow: 0 0 4px #eee683;
    }
</style>
