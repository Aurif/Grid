<script setup lang="ts">
  import { onMounted, ref } from 'vue';
import LetterManager from './letter-manager';
import TriggerManager from './trigger-manager';

    
  const triggerList = ref<{x: number, y: number, id: string}[]>([])
  const triggerManager = new TriggerManager(triggerList)

  const span = ref<HTMLSpanElement[] | null>(null)
  const letterManager = new LetterManager(span, triggerManager)

  const parentElement = ref<HTMLDivElement | null>(null)
  onMounted(()=>{
    window.addEventListener("mousemove", (e) => {
        if(!parentElement.value) return
        parentElement.value.style.setProperty('--animation-state-x', Math.round((-e.clientX/window.innerWidth*1000))/10+'s')
        parentElement.value.style.setProperty('--animation-state-y', Math.round((-e.clientY/window.innerHeight*1000))/10+'s')
    })

    setTimeout(() => {
        for(let entry of ["AWESOME", "AMAZING", "COOL", "OUTSTANDING", "PIPEBOMB", "UNNECESSARY", "HALF-GRID", "WEIRD", "INTERESTING", "IMPRESSIVE", "OVERENGINEERED"]) letterManager.placeEntryRandomly(entry)
        letterManager.applyPositions()
    }, 100)
    // TODO: proper delayed queue
  })

  const charset = 'ABCDEFGHIJKLMNOPRSTUVWXYZ-'
</script>

<template>
    <div class="parent" ref="parentElement">
        <div v-for="trigger in triggerList" :key="trigger.id" :id="trigger.id" :style="{left: `calc(${trigger.x}px - 1.5vw)`, top: `${trigger.y}px`}"></div>
        <span v-for="i in charset.length*12" :key="i" ref="span">{{ charset[i%charset.length] }}</span>
    </div>
</template>

<style scoped>
    .parent {
        position: absolute;
        left: 50%;
        top: calc(50% - 15px);
    }

    .parent div {
        width: 3vw;
        height: 3vh;
        position: absolute;
        z-index: 100;
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
        position: absolute;
        animation-duration: 100s;
        animation-play-state: paused;
        animation-timing-function: linear;
        animation-delay: var(--animation-state-x), var(--animation-state-y);
        transition: opacity 0.5s, text-shadow 0.5s;
        text-shadow: 0 0 4px transparent;
    }
</style>