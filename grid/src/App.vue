<script setup lang="ts">
  import { determinePositioning } from './input/positioning'
  import StateDisplay from './model/state-display'
  import GridRenderer from './view/GridRenderer.vue'
  import InputRenderer from './view/InputRenderer.vue'
  import GridUpdater from './view/grid-updater';
  import { Command } from './common/command'
  import ModelScatter from './model/model-scatter'
  import StateEntriesGist from './model/state-entries-gist';
  import { ref } from 'vue';
  import GridRendererProxy from "./view/grid-renderer-proxy"
  import type { ComponentRef } from './common/types';
  import DoubleClickInput from "./input/double-click";
  import MultiInputProxy from './input/multi-input-proxy';
  import Entity, { anonymousEntity } from './common/entity';
  import { makeContext, blankContext, type ContextCall, callOnInit } from './common/context';
  import ModelHeader from './model/model-header';
  import { StateCyclic } from './model/state-cyclic';
  import ClickInput from "./input/click";

  const { rows, columns } = determinePositioning()
  const displayState = new StateDisplay(rows, columns)

  const gridRenderer = ref() as ComponentRef<typeof GridRenderer>
  const gridRendererProxy = new GridRendererProxy(gridRenderer)
  const gridUpdater = new GridUpdater(gridRendererProxy)
  
  const memoryState = new StateEntriesGist([rows, columns])
  const gridInputProxy = new MultiInputProxy(el => {
    let pos = gridRendererProxy.spanToPos(el)
    if (!pos) return 
    let owners = displayState.reader.getOwnersAt(...pos)
    if (owners.length == 1) return owners[0].inputAcceptor
  })
  const scatterInputProxy = gridInputProxy.subset()
  .on(DoubleClickInput(), target => {
    let call = blankContext()
    hideFromGrid(call, target)
    call(memoryState.removeEntry, target.uid)
  })
  function hideFromGrid(call: ContextCall, target: Entity) {
    let otherLetters = displayState.reader.getOwnedBy(target)
    for(let pos of otherLetters) {
      call(displayState.removeAt, ...pos, target)
      if(displayState.reader.getOwnersAt(...pos).length == 0) call(gridUpdater.disablePos, ...pos)
    }
  }
  
  const scatterModel = new ModelScatter(
    Command.combine<[x: number, y: number, char: string, owner: Entity]>(
      gridUpdater.setChar, 
      gridUpdater.enablePos, 
      (call: ContextCall, x: number, y: number, value: string, owner: Entity) => call(displayState.setAt, x, y, value, owner.withInput(scatterInputProxy.acceptor))
    ), 
    displayState.reader
  )
  memoryState.listeners.add(scatterModel.displayEntry)



  const cyclicState = new StateCyclic([
    {label: "TODAY"},
    {label: "THIS WEEK"},
    {label: "THIS MONTH"},
    {label: "NEXT 4 MONTHS"},
  ])
  const headerEntity = anonymousEntity()
    .withInput(
      gridInputProxy.subset()
        .on(ClickInput(), () => {blankContext()(cyclicState.cycleNext)})
        .acceptor
    )
  const headerModel = new ModelHeader(
    Command.combine<[x: number, y: number, char: string]>(
      gridUpdater.setChar, 
      gridUpdater.enablePos, 
      (call: ContextCall, x: number, y: number, value: string) => call(displayState.setAt, x, y, value, headerEntity)
    ), 
    displayState.reader
  )
  cyclicState.listeners.add(Command.combine<[value: { label: string; }]>(
    (call: ContextCall) => hideFromGrid(call, headerEntity),
    (call: ContextCall, {label}) =>  call(headerModel.setContent, label),
  ))
  callOnInit(headerModel.setContent, cyclicState.reader.getCurrent("label"))
</script>

<template>
  <GridRenderer :rows="rows" :columns="columns" :bind="gridUpdater" ref="gridRenderer"/>
  <InputRenderer :rows="rows" @onNewEntry="makeContext($event)(memoryState.addEntry, $event)"/>
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
