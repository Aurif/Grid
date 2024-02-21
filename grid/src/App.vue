<script setup lang="ts">
  import { determinePositioning } from './input/positioning'
  import DisplayState from './model/display-state'
  import GridRenderer from './view/GridRenderer.vue'
  import InputRenderer from './view/InputRenderer.vue'
  import GridUpdater from './view/grid-updater';
  import { Command } from './common/command'
  import ScatterModel from './model/scatter-model'
  import MemoryStateGist from './model/memory-state-gist';
  import { ref } from 'vue';
  import GridRendererProxy from "./view/grid-renderer-proxy"
  import type { ComponentRef } from './common/types';
  import DoubleClickInput from "./input/double-click";
  import InputAcceptor from './input/input-acceptor';

  const { rows, columns } = determinePositioning()
  const displayState = new DisplayState(rows, columns)

  const gridRenderer = ref() as ComponentRef<typeof GridRenderer>
  const gridRendererProxy = new GridRendererProxy(gridRenderer)
  
  const doubleClickInput = new DoubleClickInput()
  doubleClickInput.addListener(el => {
    let pos = gridRendererProxy.spanToPos(el)
    if (!pos) return
    let acceptor = displayState.reader.getInputAcceptorAt(...pos)
    if(acceptor) acceptor.trigger(doubleClickInput)
  })
  const GridInputAcceptor = new InputAcceptor()
    .on(doubleClickInput, target => console.log(target.id))
  

  const gridUpdater = new GridUpdater(gridRendererProxy)
  const scatterModel = new ScatterModel(
    Command.combine(
      gridUpdater.setChar, 
      gridUpdater.enablePos, 
      (x: number, y: number, value: string, owner: string) => displayState.setAt(x, y, value, GridInputAcceptor.spawn(owner))
    ), 
    displayState.reader
  )
  const memoryState = new MemoryStateGist([rows, columns], [scatterModel.displayEntry])
</script>

<template>
  <GridRenderer :rows="rows" :columns="columns" :bind="gridUpdater" ref="gridRenderer"/>
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
