<script setup lang="ts">
    defineProps(['rows', 'columns'])

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
