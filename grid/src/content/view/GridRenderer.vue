<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { ref, watch, type Ref } from 'vue';

    const props = defineProps<{
        rows: Ref<number>, 
        columns: Ref<number>
    }>()
    let uid: string = uuidv4()

    const chars = ref<{[id: string]: HTMLSpanElement}>({})
    let stateId = 0
    watch(() => [props.rows.value, props.columns.value], () => {stateId++})

    function randomChar() {
        let charset = 'ABCDEFGHIJKLMNOPRSTUVWXYZ#%:+1234567890'.split('');
        return charset[Math.floor(Math.random() * charset.length)];
    }

    function posToChar(x: number, y: number): HTMLSpanElement {
        if (x < 0 || x >= props.columns.value || y < 0 || y >= props.rows.value) throw new Error(`Out of bounds (${x}, ${y})`);
        return chars.value[x+':'+y]
    }
    function spanToPos(span: HTMLElement): [number, number] | undefined {
        if (span.getAttribute("container-uid") != uid) return
        let posX = span.getAttribute("pos-x")
        let posY = span.getAttribute("pos-y")
        if (posX == null || posY == null) throw new Error("Corrupted grid element "+span)
        return [parseInt(posX), parseInt(posY)]
    }
    defineExpose({posToChar, spanToPos})
</script>

<template>
    <div class="parent">
        <div class="row" v-for="y in rows.value*1" :key="y">
            <span v-for="x in columns.value*1" :key="stateId+':'+(x-1)+':'+(y-1)" 
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
        --color-active: #eee683;
        color: #ffffff;
        font-size: 30px;
        opacity: 0.1;
        user-select: none;
        width: 16px;
        flex-grow: 1;
        text-align: center;
    }
    span.active {
        opacity: 1;
        color: var(--color-active);
        text-shadow: 0 0 4px var(--color-active);
    }
</style>
