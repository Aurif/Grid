<script setup lang="ts">

import { callOnInit } from '@/common/core/context';
import type { ComponentRef } from '@/common/utils/types';
import ModelBranchesCone from '@/content/model/model-branches-cone';
import TreeRenderer from '@/content/view/TreeRenderer.vue';
import TreeRendererProxy from '@/content/view/tree-renderer-proxy';
import TreeUpdater from '@/content/view/tree-updater';
import { ref } from 'vue';

  const treeRenderer = ref() as ComponentRef<typeof TreeRenderer>
  const treeRendererProxy = new TreeRendererProxy(treeRenderer)
  const treeUpdater = new TreeUpdater(treeRendererProxy)
  const modelBranches = new ModelBranchesCone(0, 60, "C1", treeUpdater.setNode)

  const data = {
    '1': { parent: 'C1' },
    '2': { parent: 'C1' },
    '3': { parent: 'C1' },
    '4': { parent: '3' },
    '5': { parent: '3' },
    '6': { parent: '2' },
    '7': { parent: '6' },
    '8': { parent: '6' },
    '9': { parent: '3' },
    '0': { parent: '3' }
  }

  callOnInit(modelBranches.render, {data})
</script>

<template>
  <TreeRenderer :min-distance="150" ref="treeRenderer"/>
</template>

<style>
</style>
