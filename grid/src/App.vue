<script setup lang="ts">
import GridRenderer from './view/GridRenderer.vue'
import InputRenderer from './view/InputRenderer.vue'
import { determinePositioning } from './input/positioning'
const { rows, columns } = determinePositioning()

import GridUpdater from './view/grid-updater';
const gridUpdater = new GridUpdater()

import { Command } from './common/command'
import ScatterModel from './model/scatter-model'
const scatterModel = new ScatterModel(Command.combine(gridUpdater.setChar, gridUpdater.enablePos))
</script>

<template>
  <GridRenderer :rows="rows" :columns="columns" :bind="gridUpdater"/>
  <InputRenderer :rows="rows" @onNewEntry="scatterModel.onNewEntry"/>
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
