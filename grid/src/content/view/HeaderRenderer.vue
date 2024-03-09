<script setup lang="ts">
    import { ref } from 'vue';

    const content = ref<string>("")
    defineExpose({content: ()=>content})
</script>

<template>
    <div>{{content}}</div>
</template>

<style scoped>
    div {
        position: fixed;
        left: 0;
        width: 100vw;
        top: 0.5em;
        height: 1em;
        font-size: 4em;
        color: #fffcf6;
        text-align: center;
        text-shadow: 0 0 4px #fffcf6;
        user-select: none;
    }
</style>
