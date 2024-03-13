<script lang="ts" setup>
  import ModuleLoader from '@/common/core/module-loader'
  import DataStoreGist from '@/common/data/data-store-gist'
  import type { ComponentRef } from '@/common/utils/types'
  import HeaderRenderer from '@/content/view/header/HeaderRenderer.vue'
  import InputUnderMouseRenderer from '@/content/view/InputUnderMouseRenderer.vue'
  import MenuCircularRenderer from '@/content/view/menu-circular/MenuCircularRenderer.vue'
  import TreeRenderer from '@/content/view/tree/TreeRenderer.vue'
  import Yggdrasil from '@/modules/yggdrasil'
  import { ref, type Ref } from 'vue'

  const props = defineProps<{ pageControl: Ref<boolean> }>()

  const treeRenderer = ref() as ComponentRef<typeof TreeRenderer>
  const headerRenderer = ref() as ComponentRef<typeof HeaderRenderer>
  const menuRenderer = ref() as ComponentRef<typeof MenuCircularRenderer>
  const menuWrapper = ref() as Ref<HTMLElement>

  const dataStore = await DataStoreGist.make('yggdrasil.json')

  const _ = ModuleLoader.init().run(Yggdrasil, {
    treeRenderer,
    headerRenderer,
    menuRenderer,
    menuWrapper,
    pageControl: props.pageControl,
    dataStore
  }).paramSpace
</script>

<template>
  <HeaderRenderer ref="headerRenderer"></HeaderRenderer>
  <div class="treeWrapper">
    <TreeRenderer ref="treeRenderer" :min-distance="150" />
    <div ref="menuWrapper" class="menuWrapper">
      <svg class="buttonWrapper" viewBox="0 0 100 100">
        <circle id="buttonBack" cx="50" cy="50" r="20" />
      </svg>
      <MenuCircularRenderer ref="menuRenderer" :segments="_.segments" />
    </div>
  </div>
  <InputUnderMouseRenderer @onNewEntry="_.newNode" />
</template>

<style scoped>
  .treeWrapper {
    height: calc(100% - 8em);
    width: 100%;
    position: absolute;
    top: 8em;
  }

  .menuWrapper {
    --size: 300px;
    width: var(--size);
    height: var(--size);
    position: absolute;
    top: calc(50% - var(--size) / 2);
    left: calc(50% - var(--size) / 2);
  }

  .buttonWrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 5;
  }

  .buttonWrapper circle {
    fill: white;
    opacity: 0;
  }

  .buttonWrapper circle:hover {
    opacity: 0.04;
  }
</style>
