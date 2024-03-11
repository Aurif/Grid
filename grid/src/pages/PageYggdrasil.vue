<script lang="ts" setup>
  import { ContextClass, blankContext, callOnInit } from '@/common/core/context'
  import DataStoreGist from '@/common/data/data-store-gist'
  import PresetUtil from '@/common/utils/preset-util'
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
  const dataStore = await DataStoreGist.make('yggdrasil.json')
  const memoryState = new StateEntries<{ parent: string; label: string }>(dataStore, entryContext)

  const treeRendererProxy = new TreeRendererProxy(treeRenderer)
  const treeUpdater = new TreeUpdater(treeRendererProxy)

  const rootBranches = new PresetUtil([
    { label: 'growth' },
    { label: 'exploration' },
    { label: 'self-expression' },
    { label: 'impact' },
    { label: 'quality of life' },
    { label: 'survival' }
  ])

  const segments = rootBranches.length
  for (let i = 0; i < segments; i++) {
    const modelBranches = new ModelBranchesCone(
      (360 / segments) * (i - 0.5) + 18 / segments,
      (360 / segments) * (i + 0.5) - 18 / segments,
      rootBranches.getAt(i).label,
      treeUpdater.setNode
    )
    callOnInit(modelBranches.render, { data: memoryState.reader.entries })
    memoryState.onUpdateData.add(modelBranches.render)
  }

  let menuFocused = true
  const circularMenuRendererProxy = new MenuCircularRendererProxy(menuRenderer)
  const circularMenuUpdater = new MenuCircularUpdater(circularMenuRendererProxy)
  const circularMenuInput = new MouseAngle(menuWrapper, segments)
  circularMenuInput.onSelected.add((call, { segment }) => {
    if (menuFocused) call(circularMenuUpdater.enableArc, { segment })
  })
  circularMenuInput.onUnselected.add(circularMenuUpdater.disableArc)

  const headerRendererProxy = new HeaderRendererProxy(headerRenderer)

  const nearestNode = new NearestElement('svg')
  nearestNode.onFocused.add((call, { target }) => {
    const eid = treeRendererProxy.elementToId(target)
    menuFocused = !eid
    if (!eid) {
      if (circularMenuInput.currentSegment != undefined) {
        const segment = circularMenuInput.currentSegment
        call(headerRendererProxy.setContent, { content: rootBranches.getAt(segment).label })
        call(circularMenuUpdater.enableArc, { segment })
      }
      return
    }

    if (circularMenuInput.currentSegment != undefined)
      call(circularMenuUpdater.disableArc, { segment: circularMenuInput.currentSegment })
    call(treeUpdater.focusNode, { nodeId: eid })
    const label = memoryState.reader.get(eid).label
    call(headerRendererProxy.setContent, { content: label })
  })
  nearestNode.onUnfocused.add((call, { target }) => {
    const eid = treeRendererProxy.elementToId(target)
    if (!eid) return

    call(treeUpdater.unfocusNode, { nodeId: eid })
  })
  circularMenuInput.onSelected.add((call, { segment }) => {
    if (!menuFocused) return
    call(headerRendererProxy.setContent, {
      content: rootBranches.getAt(segment).label
    })
  })

  function newNode(content: string) {
    let parentNode = nearestNode.currentNearestElement
    if (!parentNode) throw Error('Tried creating a node without a parent')
    let eid = treeRendererProxy.elementToId(parentNode)
    if (!eid) {
      if (circularMenuInput.currentSegment == undefined)
        throw Error('Tried creating a root-level node without a selection from cyclical menu')
      eid = rootBranches.getAt(circularMenuInput.currentSegment).label
    }

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
