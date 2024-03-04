<script setup lang="ts">
import ConstantFocusField from '@/components/ConstantFocusField.vue';
import { computed, type Ref } from 'vue';

    const emit = defineEmits(['onNewEntry'])
    let props = defineProps<{
        rows: Ref<number>
    }>()
    let inputHeight = computed(() => window.innerHeight/props.rows.value*(props.rows.value % 2 ? 3 : 2))
</script>

<template>
    <div class="wrapper">
        <ConstantFocusField :style="{'--input-font-size': inputHeight + 'px'}" :required="true" @on-input="emit('onNewEntry', $event)" />
    </div>
</template>

<style scoped>
    :deep(input) {
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

    :deep(input:invalid) {
        caret-color: transparent;
        color: transparent;
        background-color: transparent;
        cursor: default;
        pointer-events: none;
    }
</style>
