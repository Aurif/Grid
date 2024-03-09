<script setup lang="ts">

import { ContextClass, callOnInit } from '@/common/core/context';
import DataStoreTemporary from '@/common/data/data-store-temporary';
import type { ComponentRef, Entry } from '@/common/utils/types';
import ModelBranchesCone from '@/content/model/model-branches-cone';
import StateEntries from '@/content/model/state-entries';
import HeaderRenderer from '@/content/view/HeaderRenderer.vue';
import TreeRenderer from '@/content/view/TreeRenderer.vue';
import HeaderRendererProxy from '@/content/view/header-renderer-proxy';
import TreeRendererProxy from '@/content/view/tree-renderer-proxy';
import TreeUpdater from '@/content/view/tree-updater';
import { ref } from 'vue';

  const treeRenderer = ref() as ComponentRef<typeof TreeRenderer>
  const headerRenderer = ref() as ComponentRef<typeof HeaderRenderer>

  const entryContext = new ContextClass<Entry<{ parent: string, label: string }>>()
  const dataStore = new DataStoreTemporary({
    '1': { label: '1', parent: 'C1' },
    '2': { label: '2', parent: 'C1' },
    '3': { label: '3', parent: 'C1' },
    '4': { label: '4', parent: '3' },
    '5': { label: '5', parent: '3' },
    '6': { label: '6', parent: '2' },
    '7': { label: '7', parent: '6' },
    '8': { label: '8', parent: '6' },
    '9': { label: '9', parent: '3' },
    '0': { label: '0', parent: '3' }
  })
  const memoryState = new StateEntries<{ parent: string, label: string }>(dataStore, entryContext)

  const treeRendererProxy = new TreeRendererProxy(treeRenderer)
  const treeUpdater = new TreeUpdater(treeRendererProxy)
  const modelBranches = new ModelBranchesCone(0, 60, "C1", treeUpdater.setNode)

  const headerRendererProxy = new HeaderRendererProxy(headerRenderer)
  callOnInit(headerRendererProxy.setContent, {content: "uwu"})

  callOnInit(modelBranches.render, {data: memoryState.reader.entries})
</script>

<template>
  <HeaderRenderer ref="headerRenderer"></HeaderRenderer>
  <div class="treeWrapper">
    <TreeRenderer :min-distance="150" ref="treeRenderer"/>
  </div>
</template>

<style scoped>
  .treeWrapper {
    height: calc(100% - 8em);
    width: 100%;
    position: absolute;
    top: 8em
  }
</style>
