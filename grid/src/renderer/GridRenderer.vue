<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue'
    const letterSize = 30;
    const xScale = 1.667;
    const yScale = 1.34;

    let columns = ref(0);
    let rows = ref(0);
    function resizeGrid() {
        columns.value = Math.floor(window.innerWidth / (letterSize / xScale) / 1.7);
        rows.value = Math.floor(window.innerHeight / (letterSize / yScale) / 1.7);
    }
    onMounted(() => window.addEventListener('resize', resizeGrid))
    onUnmounted(() => window.removeEventListener('resize', resizeGrid))
    resizeGrid();

    function randomChar() {
        let charset = 'ABCDEFGHIJKLMNOPRSTUVWXYZ#%:+1234567890';
        return charset.charAt(Math.floor(Math.random() * charset.length));
    }
</script>

<template>
    <div class="parent">
        <div class="row" v-for="y in rows*1">
            <span v-for="x in columns*1">
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
    }
</style>
