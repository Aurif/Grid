<script setup lang="ts">

import GridRenderer from './view/GridRenderer.vue';
import InputRenderer from './view/InputRenderer.vue';

import ModuleLoader from '@/common/module-loader';
import Grid from '@/modules/grid';
import TimeStages from '@/modules/time-stages';
import TodoList from '@/modules/todo-list';
import { ref } from 'vue';
import type { ComponentRef } from './common/types';


  const gridRenderer = ref() as ComponentRef<typeof GridRenderer>

  const _ = 
  ModuleLoader.init()
    .run(Grid, {gridRenderer})
    .run(TodoList)
    .run(TimeStages)
    .paramSpace

  
</script>

<template>
  <GridRenderer :rows="_.rows" :columns="_.columns" :bind="_.gridUpdater" ref="gridRenderer"/>
  <InputRenderer :rows="_.rows" @onNewEntry="_.entryCreationContext.make(null)(_.memoryState.addEntry, {entry: {value: $event}})"/>
</template>

<style>
  body {
    background-color: #181818;
    margin: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  #app {
    height: 100%;
    width: 100%;
  }
</style>
