<script setup lang="ts">
    import { onMounted, onUnmounted, ref } from 'vue';
    defineProps<{ required: boolean }>()
    const emit = defineEmits(['onInput'])
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
        if (value) emit('onInput', value);
    }
    onMounted(() => {
        refocus(); 
        input.value!.addEventListener('blur', refocus);
        window.addEventListener("focus", refocus)
        document.getElementsByTagName('body')[0].addEventListener("keydown", onInput)
    })
    onUnmounted(() => {
        window.removeEventListener("focus", refocus)
        document.getElementsByTagName('body')[0].removeEventListener("keydown", onInput)
    })
    
</script>

<template>
    <input ref="input" type="text" auto-focus :required="required">
</template>

<style scoped>
</style>
