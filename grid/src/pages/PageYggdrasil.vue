<script lang="ts" setup>
  import { ContextClass, callOnInit } from '@/common/core/context'
  import DataStoreTemporary from '@/common/data/data-store-temporary'
  import type { ComponentRef, Entry } from '@/common/utils/types'
  import NearestElement from '@/content/input/nearest-element'
  import ModelBranchesCone from '@/content/model/model-branches-cone'
  import StateEntries from '@/content/model/state-entries'
  import HeaderRenderer from '@/content/view/header/HeaderRenderer.vue'
  import HeaderRendererProxy from '@/content/view/header/header-renderer-proxy'
  import TreeRenderer from '@/content/view/tree/TreeRenderer.vue'
  import TreeRendererProxy from '@/content/view/tree/tree-renderer-proxy'
  import TreeUpdater from '@/content/view/tree/tree-updater'
  import { ref } from 'vue'
  import InputUnderMouseRenderer from '@/content/view/InputUnderMouseRenderer.vue'

  const treeRenderer = ref() as ComponentRef<typeof TreeRenderer>
  const headerRenderer = ref() as ComponentRef<typeof HeaderRenderer>

  const entryContext = new ContextClass<Entry<{ parent: string; label: string }>>()
  const dataStore = new DataStoreTemporary({
    '1': { label: 'L-1', parent: 'C1' },
    '2': { label: 'L-2', parent: 'C1' },
    '3': { label: 'L-3', parent: 'C1' },
    '4': { label: 'L-4', parent: '3' },
    '5': { label: 'L-5', parent: '3' },
    '6': { label: 'L-6', parent: '2' },
    '7': { label: 'L-7', parent: '6' },
    '8': { label: 'L-8', parent: '6' },
    '9': { label: 'L-9', parent: '3' },
    '0': { label: 'L-0', parent: '3' }
  })
  const memoryState = new StateEntries<{ parent: string; label: string }>(dataStore, entryContext)

  const treeRendererProxy = new TreeRendererProxy(treeRenderer)
  const treeUpdater = new TreeUpdater(treeRendererProxy)
  const modelBranches = new ModelBranchesCone(0, 60, 'C1', treeUpdater.setNode)
  callOnInit(modelBranches.render, { data: memoryState.reader.entries })

  const headerRendererProxy = new HeaderRendererProxy(headerRenderer)

  const nearestNode = new NearestElement('svg')
  nearestNode.onFocused.add((call, { target }) => {
    const eid = treeRendererProxy.elementToId(target)
    if (!eid) return

    call(treeUpdater.focusNode, { nodeId: eid })
    const label = memoryState.reader.get(eid).label
    call(headerRendererProxy.setContent, { content: label })
  })
  nearestNode.onUnfocused.add((call, { target }) => {
    const eid = treeRendererProxy.elementToId(target)
    if (!eid) return

    call(treeUpdater.unfocusNode, { nodeId: eid })
  })
</script>

<template>
  <HeaderRenderer ref="headerRenderer"></HeaderRenderer>
  <div class="treeWrapper">
    <TreeRenderer ref="treeRenderer" :min-distance="150" />
  </div>
  <InputUnderMouseRenderer />
</template>

<style scoped>
  .treeWrapper {
    height: calc(100% - 8em);
    width: 100%;
    position: absolute;
    top: 8em;
  }
</style>
