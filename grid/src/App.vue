<script lang="ts" setup>
  import ModuleLoader from '@/common/core/module-loader'
  import SlotRenderer from '@/common/core/slots/slot-renderer.vue'
  import DataStoreGist from '@/common/data/data-store-gist'
  import Grid from '@/modules/grid'
  import TimeStages from '@/modules/time-stages'
  import TodoList from '@/modules/todo-list'

  ModuleLoader.init()
    .run(Grid, {})
    .run(TodoList, { dataStore: await DataStoreGist.make('grid.json') })
    .run(TimeStages, {})
</script>

<template>
  <SlotRenderer />
</template>
