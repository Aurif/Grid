import { Command } from '@/common/core/commands/command'
import { ContextClass, blankContext } from '@/common/core/commands/context'
import { anonymousEntity } from '@/common/core/commands/entity'
import DataStoreGist from '@/common/data/data-store-gist'
import cycleNext from '@/common/utils/cycle-next'
import PresetUtil from '@/common/utils/preset-util'
import type { ComponentRef, Entry } from '@/common/utils/types'
import MouseAngle from '@/content/input/mouse-angle'
import type MultiInputProxy from '@/content/input/multi-input-proxy'
import NearestElement from '@/content/input/nearest-element'
import InputClickDouble from '@/content/input/triggers/click-double'
import ModelBranchesCone from '@/content/model/model-branches-cone'
import ModelCorner from '@/content/model/model-corner'
import type ModelScatter from '@/content/model/model-scatter'
import type StateDisplay from '@/content/model/state-display'
import StateEntries from '@/content/model/state-entries'
import type GridUpdater from '@/content/view/grid/grid-updater'
import HeaderRenderer from '@/content/view/header/HeaderRenderer.vue'
import HeaderRendererProxy from '@/content/view/header/header-renderer-proxy'
import MenuCircularRenderer from '@/content/view/menu-circular/MenuCircularRenderer.vue'
import MenuCircularRendererProxy from '@/content/view/menu-circular/menu-circular-renderer-proxy'
import MenuCircularUpdater from '@/content/view/menu-circular/menu-circular-updater'
import TreeRenderer from '@/content/view/tree/TreeRenderer.vue'
import TreeRendererProxy from '@/content/view/tree/tree-renderer-proxy'
import TreeUpdater from '@/content/view/tree/tree-updater'
import { type Ref } from 'vue'

export function yggdrasilMixinGrid({
  displayState,
  gridUpdater,
  entryContext,
  scatterModel,
  gridInputProxy,
  pageControl,
  dataStore
}: {
  displayState: StateDisplay
  gridUpdater: GridUpdater
  entryContext: ContextClass<Entry<{ value: string }>>
  scatterModel: ModelScatter
  gridInputProxy: MultiInputProxy
  pageControl: Ref<boolean>
  dataStore: DataStoreGist<{ [id: string]: Entry<{ parent: string; label: string }> }>
}) {
  const cornerDisplayEntity = anonymousEntity()
  cornerDisplayEntity.withInput(
    gridInputProxy.subset().on(InputClickDouble(), () => {
      pageControl.value = true
    }).acceptor
  )

  const cornerModel = new ModelCorner(
    Command.combine(
      displayState.setAt.mapArg('owner', () => cornerDisplayEntity),
      gridUpdater.setChar,
      gridUpdater.enablePos,
      gridUpdater.setColor.mapArg('color', () => '#ffffff')
    ),
    displayState.reader
  )
  displayState.reader.watchResize(() => {
    blankContext()(cornerModel.rerender, {})
  })

  const yggdrasilEntryContext = new ContextClass<Entry<{ parent: string; label: string }>>()
  const memoryState = new StateEntries<{ parent: string; label: string }>(
    dataStore,
    yggdrasilEntryContext
  )
  memoryState.onUpdateData.add((call, { data }) => {
    call(cornerModel.setDisplayedEntries, {
      entries: [
        '🜍',
        ...Object.values(data)
          .filter((e) => e.state == 'in-progress')
          .map((e) => e.label)
      ]
    })
  })
}

export default function ({
  treeRenderer,
  headerRenderer,
  menuRenderer,
  menuWrapper,
  pageControl,
  dataStore
}: {
  treeRenderer: ComponentRef<typeof TreeRenderer>
  headerRenderer: ComponentRef<typeof HeaderRenderer>
  menuRenderer: ComponentRef<typeof MenuCircularRenderer>
  menuWrapper: Ref<HTMLElement>
  pageControl: Ref<boolean>
  dataStore: DataStoreGist<{ [id: string]: Entry<{ parent: string; label: string }> }>
}) {
  const entryContext = new ContextClass<Entry<{ parent: string; label: string }>>()
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
      Command.combine(treeUpdater.setNode, (call, args, context) => {
        const state = nodeStates.getBy('mark', context.state)
        call(treeUpdater.setColor.nextTick(), {
          nodeId: args.id,
          color: state.color
        })
        call(treeUpdater.setNodeStyle.nextTick(), {
          nodeId: args.id,
          style: state.style
        })
      }),
      entryContext
    )
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

  const nearestNode = new NearestElement('circle, .menuWrapper')
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
    const parentNode = nearestNode.currentNearestElement
    if (!parentNode) throw Error('Tried creating a node without a parent')
    let eid = treeRendererProxy.elementToId(parentNode)
    if (!eid) {
      if (circularMenuInput.currentSegment == undefined)
        throw Error('Tried creating a root-level node without a selection from cyclical menu')
      eid = rootBranches.getAt(circularMenuInput.currentSegment).label
    }

    blankContext()(memoryState.addEntry, { entry: { label: content, parent: eid } })
  }

  const nodeStates = new PresetUtil([
    { mark: undefined },
    { mark: 'in-progress', color: '#6bff28', style: 'glow' },
    { mark: 'done', color: '#464646', style: 'dashed' }
  ])

  InputClickDouble().addListener((target) => {
    if (target.id == 'buttonBack') {
      pageControl.value = false
      return true
    }

    const parentNode = nearestNode.currentNearestElement
    if (!parentNode) return false
    const eid = treeRendererProxy.elementToId(parentNode)
    if (!eid) return false
    const currentValue = memoryState.reader.get(eid)
    const newState = cycleNext(nodeStates.getValuesOf('mark'), currentValue['state'])
    blankContext()(memoryState.updateEntry, { eid, entry: { ...currentValue, state: newState } })

    return false
  })

  return { newNode, segments }
}
