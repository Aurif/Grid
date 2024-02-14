<script setup lang="ts">
  import { determinePositioning } from './input/positioning'
  import DisplayState from './model/display-state'
  import GridRenderer from './view/GridRenderer.vue'
  import InputRenderer from './view/InputRenderer.vue'
  import GridUpdater from './view/grid-updater';
  import { Command } from './common/command'
  import ScatterModel from './model/scatter-model'
  import MemoryState from './model/memory-state';


  const { rows, columns } = determinePositioning()
  const displayState = new DisplayState(rows, columns)

  const gridUpdater = new GridUpdater()
  const scatterModel = new ScatterModel(Command.combine(gridUpdater.setChar, gridUpdater.enablePos, displayState.setAt), displayState.reader)
  const memoryState = new MemoryState([rows, columns], [scatterModel.displayEntry])
</script>

<template>
  <GridRenderer :rows="rows" :columns="columns" :bind="gridUpdater"/>
  <InputRenderer :rows="rows" @onNewEntry="memoryState.addEntry"/>
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
