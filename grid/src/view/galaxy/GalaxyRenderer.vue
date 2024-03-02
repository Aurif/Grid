<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import LetterManager from './letter-manager'

  const span = ref<HTMLSpanElement[] | null>(null)
  const letterManager = new LetterManager(span)

  const parentElement = ref<HTMLDivElement | null>(null)
  onMounted(()=>{
    window.addEventListener("mousemove", (e) => {
        if(!parentElement.value) return
        parentElement.value.style.setProperty('--animation-state-x', Math.round((-e.clientX/window.innerWidth*1000))/10+'s')
        parentElement.value.style.setProperty('--animation-state-y', Math.round((-e.clientY/window.innerHeight*1000))/10+'s')
    })

    setTimeout(() => {
        for(let entry of ["AWESOME", "AMAZING", "COOL", "OUTSTANDING", "PIPEBOMB"]) letterManager.placeEntryRandomly(entry)
        letterManager.applyPositions()
    }, 100)
    // TODO: proper queue
  })

  const charset = 'ABCDEFGHIJKLMNOPRSTUVWXYZ'
</script>

<template>
    <div ref="parentElement">
        <span v-for="i in charset.length*6" :key="i" ref="span">{{ charset[i%charset.length] }}</span>
    </div>
</template>

<style scoped>
    div {
        position: absolute;
        left: 50%;
        top: calc(50% - 15px);
    }

    span {
        --color-active: #eee683;
        color: #ffffff;
        font-size: 30px;
        font-family: 'Roboto Mono', monospace;
        opacity: max(0.1, min(var(--opacity-x), var(--opacity-y)));
        user-select: none;
        width: 16px;
        flex-grow: 1;
        text-align: center;
        position: absolute;
        animation-duration: 100s;
        animation-play-state: paused;
        animation-timing-function: linear;
        animation-delay: var(--animation-state-x), var(--animation-state-y);
    }

    span.active {
        opacity: 1;
        color: var(--color-active);
        text-shadow: 0 0 4px var(--color-active);
    }
</style>