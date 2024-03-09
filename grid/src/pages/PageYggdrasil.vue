<script setup lang="ts">

import { callOnInit } from '@/common/core/context';
import type { ComponentRef } from '@/common/utils/types';
import TreeRenderer from '@/content/view/TreeRenderer.vue';
import TreeRendererProxy from '@/content/view/tree-renderer-proxy';
import TreeUpdater from '@/content/view/tree-updater';
import { ref } from 'vue';

  const treeRenderer = ref() as ComponentRef<typeof TreeRenderer>
  const treeRendererProxy = new TreeRendererProxy(treeRenderer)
  const treeUpdater = new TreeUpdater(treeRendererProxy)

  callOnInit(treeUpdater.setNode, {id: "1", degree: 15, layer: 1})
  callOnInit(treeUpdater.setNode, {id: "3", degree: 45, layer: 1})
  callOnInit(treeUpdater.setNode, {id: "33", degree: 30, layer: 2})
  callOnInit(treeUpdater.setNode, {id: "3", degree: 45, layer: 0.5})

</script>

<template>
  <TreeRenderer :min-distance="100" ref="treeRenderer"/>
</template>

<style>
</style>
