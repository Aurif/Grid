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
  import InputClickDouble from "./input/triggers/click-double";
  import MultiInputProxy from './input/multi-input-proxy';
  import Entity, { anonymousEntity } from './common/entity';
  import { blankContext, type ContextCall, callOnInit, ContextClass } from './common/context';
  import ModelHeader from './model/model-header';
  import { StateCyclic } from './model/state-cyclic';
  import InputClick from "./input/triggers/click";
  import type { Entry } from './model/state-entries';
  import PresetUtil from './common/preset-util';
  import InputClickRight from './input/triggers/click-right';
  import InputScrollDown from './input/triggers/scroll-down';
  import InputScrollUp from './input/triggers/scroll-up';

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
  .on(InputClickDouble(), target => {
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
      displayState.setAt.mapArg('owner', ({owner})=>owner.withInput(scatterInputProxy.acceptor))
    ), 
    displayState.reader
  )
  memoryState.onNewEntry.add((call: ContextCall, {entry: {value}, eid}) => call(scatterModel.displayEntry, {entry: value, eid}))
  memoryState.onUpdateEntry.add((call: ContextCall, {eid}) => call(scatterModel.updateEntry, {eid}))


  const timeStages = new PresetUtil([
    {label: "TODAY", color: '#f98f71', mark: 'day'},
    {label: "THIS WEEK"},
    {label: "THIS MONTH", color: '#765c81', mark: 'month'},
    {label: "NEXT 4 MONTHS", color: '#384456', mark: 'quarter'},
  ])
  const cyclicState = new StateCyclic(timeStages.values)
  const headerEntity = anonymousEntity()
    .withInput(
      gridInputProxy.subset()
        .on(InputClick(), () => {blankContext()(cyclicState.cycleNext, {})})
        .on(InputClickRight(), () => {blankContext()(cyclicState.cyclePrev, {})})
        .on(InputScrollDown(), () => {blankContext()(cyclicState.cycleNext, {})})
        .on(InputScrollUp(), () => {blankContext()(cyclicState.cyclePrev, {})})
        .acceptor
    )
  const headerModel = new ModelHeader(
    Command.combine(
      gridUpdater.setChar, 
      gridUpdater.enablePos, 
      gridUpdater.setColor.mapArg("color", ()=>cyclicState.reader.getCurrent('color')),
      displayState.setAt.mapArg('owner', ()=>headerEntity)
    ), 
    displayState.reader
  )
  cyclicState.listeners.add(Command.combine(
    (call: ContextCall) => hideFromGrid(call, headerEntity),
    headerModel.setContent.mapArg("content", ({value: {label}})=>label)
  ))
  callOnInit(headerModel.setContent, {content: cyclicState.reader.getCurrent("label")})
  entryCreationContext.registerModifier(memoryState.addEntry, command=>{
    if (!cyclicState.reader.getCurrent('mark')) return command
    return command.mapArg("entry", ({entry})=>({...entry, 'time-stage': cyclicState.reader.getCurrent("mark")}))
  })
  entryContext.registerModifier(gridUpdater.setChar, (command, context)=>{
    return command.addPostCall(gridUpdater.setColor.mapArg("color", ()=>timeStages.getBy('mark', context['time-stage']).color))
  })
  entryContext.registerModifier(displayState.setAt, (command, context)=>{
    if (context['time-stage'] == timeStages.getAt(0).mark) return command
    const modifiedInputProxy = gridInputProxy.subset()
      .on(InputClickDouble(), target => {
        let call = blankContext()
        let newStage = timeStages.getAt(timeStages.getIndexBy('mark', context['time-stage'])-1).mark
        call(memoryState.updateEntry, {eid: target.uid, entry: {...context, 'time-stage': newStage}})
      }).acceptor
    return command.mapArg("owner", ({owner})=>owner.withInput(modifiedInputProxy))
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
