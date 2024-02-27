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
  import { blankContext, type ContextCall, callOnInit, ContextClass } from './common/context';
  import ModelHeader from './model/model-header';
  import { StateCyclic } from './model/state-cyclic';
  import ClickInput from "./input/click";
  import type { Entry } from './model/state-entries';

  const { rows, columns } = determinePositioning()
  const displayState = new StateDisplay(rows, columns)

  const gridRenderer = ref() as ComponentRef<typeof GridRenderer>
  const gridRendererProxy = new GridRendererProxy(gridRenderer)
  const gridUpdater = new GridUpdater(gridRendererProxy)
  
  const entryCreationContext = new ContextClass<null>()
  const entryContext = new ContextClass<Entry>()

  const memoryState = new StateEntriesGist([rows, columns], entryContext)
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
    call(memoryState.removeEntry, {eid: target.uid})
  })
  function hideFromGrid(call: ContextCall, target: Entity) {
    let otherLetters = displayState.reader.getOwnedBy(target)
    for(let pos of otherLetters) {
      call(displayState.removeAt, {...pos, owner: target})
      if(displayState.reader.getOwnersAt(pos.x, pos.y).length == 0) call(gridUpdater.disablePos, pos)
    }
  }
  
  const scatterModel = new ModelScatter(
    Command.combine<{x: number, y: number, char: string, owner: Entity}>(
      gridUpdater.setChar, 
      gridUpdater.enablePos, 
      (call: ContextCall, args) => call(displayState.setAt, {...args, owner: args.owner.withInput(scatterInputProxy.acceptor)})
    ), 
    displayState.reader
  )
  memoryState.listeners.add((call: ContextCall, {entry: {value}, eid}) => call(scatterModel.displayEntry, {entry: value, eid}))



  const cyclicState = new StateCyclic([
    {label: "TODAY", color: '#f98f71'},
    {label: "THIS WEEK"},
    {label: "THIS MONTH", color: '#9673a4'},
    {label: "NEXT 4 MONTHS", color: '#4a5c78'},
  ])
  const headerEntity = anonymousEntity()
    .withInput(
      gridInputProxy.subset()
        .on(ClickInput(), () => {blankContext()(cyclicState.cycleNext, {})})
        .acceptor
    )
  const headerModel = new ModelHeader(
    Command.combine<{x: number, y: number, char: string}>(
      gridUpdater.setChar, 
      gridUpdater.enablePos, 
      (call: ContextCall, args) => call(gridUpdater.setColor, {...args, color: cyclicState.reader.getCurrent('color')}),
      (call: ContextCall, args) => call(displayState.setAt, {...args, owner: headerEntity})
    ), 
    displayState.reader
  )
  cyclicState.listeners.add(Command.combine<{value: { label: string; }}>(
    (call: ContextCall) => hideFromGrid(call, headerEntity),
    (call: ContextCall, {value: {label}}) =>  call(headerModel.setContent, {content: label}),
  ))
  callOnInit(headerModel.setContent, {content: cyclicState.reader.getCurrent("label")})
  entryCreationContext.registerModifier(memoryState.addEntry, ()=>true, command=>{
    console.log("Modification!")
    return command
  })
</script>

<template>
  <GridRenderer :rows="rows" :columns="columns" :bind="gridUpdater" ref="gridRenderer"/>
  <InputRenderer :rows="rows" @onNewEntry="entryCreationContext.make(null)(memoryState.addEntry, {entry: {value: $event}})"/>
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
