<script setup lang="ts">
    import { ref, onMounted, onUnmounted, computed } from 'vue'
    const emit = defineEmits(['onNewEntry'])
    const input = ref<HTMLInputElement | null>(null)

    function refocus() {
        input.value?.focus();
        setTimeout(function() { input.value?.focus(); }, 10);
    }
    function onInput(event: KeyboardEvent) {
        if (event.keyCode !== 13) return;
        event.preventDefault();

        let value = input.value?.value.toUpperCase();
        input.value!.value = '';
        if (value) emit('onNewEntry', value);
    }
    onMounted(() => {
        refocus(); 
        input.value!.addEventListener('blur', refocus);
        window.addEventListener("focus", refocus)
        document.getElementsByTagName('body')[0].addEventListener("keydown", onInput)
    })
    onUnmounted(() => {
        input.value!.removeEventListener('blur', refocus)
        window.removeEventListener("focus", refocus)
        document.getElementsByTagName('body')[0].removeEventListener("keydown", onInput)
    })

    let props = defineProps(['rows'])
    let inputHeight = computed(() => window.innerHeight/props.rows*(props.rows % 2 ? 3 : 2))
</script>

<template>
    <input :style="{'--input-font-size': inputHeight + 'px'}" ref="input" id="text-input" type="text" auto-focus required>
</template>

<style scoped>
    #text-input {
        position: fixed;
        left: 0;
        width: 100vw;
        top: calc(50% - var(--input-font-size) / 2);
        height: var(--input-font-size);
        font-size: var(--input-font-size);
        border: none;
        outline: none;
        color: #fffcf6;
        caret-color: #fff2d3;
        text-align: center;
        text-transform: uppercase;
        font-family: monospace;
        transition: background-color 0.5s;
        background-color: #181818;
    }

    #text-input:invalid {
        caret-color: transparent;
        color: transparent;
        background-color: transparent;
        cursor: default;
        pointer-events: none;
    }
</style>
