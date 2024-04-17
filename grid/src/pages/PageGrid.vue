<script lang="ts" setup>
  import ModuleLoader from '@/common/core/module-loader'
  import DataStoreGist from '@/common/data/data-store-gist'
  import type { ComponentRef } from '@/common/utils/types'
  import GridRenderer from '@/content/view/grid/GridRenderer.vue'
  import InputRenderer from '@/content/view/InputGlobalRenderer.vue'
  import Grid from '@/modules/grid'
  import TimeStages from '@/modules/time-stages'
  import TodoList from '@/modules/todo-list'
  import { yggdrasilMixinGrid } from '@/modules/yggdrasil'
  import { ref, type Ref } from 'vue'

  const props = defineProps<{ pageControl: Ref<boolean> }>()

  const gridRenderer = ref() as ComponentRef<typeof GridRenderer>

  const _ = ModuleLoader.init()
    .run(Grid, { gridRenderer })
    .run(TodoList, { dataStore: await DataStoreGist.make('grid.json') })
    .run(TimeStages, {})
    .run(yggdrasilMixinGrid, {
      pageControl: props.pageControl,
      dataStore: await DataStoreGist.make('yggdrasil.json')
    }).paramSpace
</script>

<template>
  <div class="fullsize panels">
    <div class="fullsize panel-main">
      <GridRenderer ref="gridRenderer" :columns="_.columns" :rows="_.rows" />
    </div>
    <div class="panel-side"></div>
  </div>

  <InputRenderer
    :rows="_.rows"
    @onNewEntry="
      _.entryCreationContext.make(null)(_.memoryState.addEntry, { entry: { value: $event } })
    "
  />
</template>

<style scoped>
  .fullsize {
    width: 100%;
    height: 100%;
  }

  .panels {
    display: grid;
    grid-template-areas: 'main right';
    grid-template-columns: auto 30em;
  }

  .panel-main {
    grid-area: main;
  }

  .panel-side {
    grid-area: right;
  }
</style>
