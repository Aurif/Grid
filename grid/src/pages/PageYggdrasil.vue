<script lang="ts" setup>
  import { ContextClass, blankContext, callOnInit } from '@/common/core/context'
  import DataStoreTemporary from '@/common/data/data-store-temporary'
  import type { ComponentRef, Entry } from '@/common/utils/types'
  import MouseAngle from '@/content/input/mouse-angle'
  import NearestElement from '@/content/input/nearest-element'
  import ModelBranchesCone from '@/content/model/model-branches-cone'
  import StateEntries from '@/content/model/state-entries'
  import InputUnderMouseRenderer from '@/content/view/InputUnderMouseRenderer.vue'
  import HeaderRenderer from '@/content/view/header/HeaderRenderer.vue'
  import HeaderRendererProxy from '@/content/view/header/header-renderer-proxy'
  import MenuCircularRenderer from '@/content/view/menu-circular/MenuCircularRenderer.vue'
  import MenuCircularRendererProxy from '@/content/view/menu-circular/menu-circular-renderer-proxy'
  import MenuCircularUpdater from '@/content/view/menu-circular/menu-circular-updater'
  import TreeRenderer from '@/content/view/tree/TreeRenderer.vue'
  import TreeRendererProxy from '@/content/view/tree/tree-renderer-proxy'
  import TreeUpdater from '@/content/view/tree/tree-updater'
  import { ref, type Ref } from 'vue'

  const treeRenderer = ref() as ComponentRef<typeof TreeRenderer>
  const headerRenderer = ref() as ComponentRef<typeof HeaderRenderer>
  const menuRenderer = ref() as ComponentRef<typeof MenuCircularRenderer>
  const menuWrapper = ref() as Ref<HTMLElement>

  const entryContext = new ContextClass<Entry<{ parent: string; label: string }>>()
  const dataStore = new DataStoreTemporary({
    '1': { label: 'L-1', parent: 'C1' },
    '2': { label: 'L-2', parent: 'C1' },
    '3': { label: 'L-3', parent: 'C1' },
    c: { label: 'L-3', parent: 'C2' },
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

  const segments = 6
  for (let i = 0; i < segments; i++) {
    const modelBranches = new ModelBranchesCone(
      (360 / segments) * (i - 0.5) + 18 / segments,
      (360 / segments) * (i + 0.5) - 18 / segments,
      'C' + i,
      treeUpdater.setNode
    )
    callOnInit(modelBranches.render, { data: memoryState.reader.entries })
    memoryState.onUpdateData.add(modelBranches.render)
  }

  const circularMenuRendererProxy = new MenuCircularRendererProxy(menuRenderer)
  const circularMenuUpdater = new MenuCircularUpdater(circularMenuRendererProxy)
  const circularMenuInput = new MouseAngle(menuWrapper, segments)
  circularMenuInput.onSelected.add(circularMenuUpdater.enableArc)
  circularMenuInput.onUnselected.add(circularMenuUpdater.disableArc)

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

  function newNode(content: string) {
    let parentNode = nearestNode.currentNearestElement
    if (!parentNode) throw Error('Tried creating a node without a parent')
    const eid = treeRendererProxy.elementToId(parentNode)
    if (!eid) throw Error('Currently focused element is not a node, code is considered corrupted')

    blankContext()(memoryState.addEntry, { entry: { label: content, parent: eid } })
  }
</script>

<template>
  <HeaderRenderer ref="headerRenderer"></HeaderRenderer>
  <div class="treeWrapper">
    <TreeRenderer ref="treeRenderer" :min-distance="200" />
    <div ref="menuWrapper" class="menuWrapper">
      <MenuCircularRenderer ref="menuRenderer" :segments="segments" />
    </div>
  </div>
  <InputUnderMouseRenderer @onNewEntry="newNode" />
</template>

<style scoped>
  .treeWrapper {
    height: calc(100% - 8em);
    width: 100%;
    position: absolute;
    top: 8em;
  }

  .menuWrapper {
    --size: 320px;
    width: var(--size);
    height: var(--size);
    position: absolute;
    top: calc(50% - var(--size) / 2);
    left: calc(50% - var(--size) / 2);
  }
</style>
