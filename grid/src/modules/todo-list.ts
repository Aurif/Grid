import SlotOverlay from '@/common/components/slots/SlotOverlay.vue'
import { Command } from '@/common/core/commands/command'
import { blankContext, ContextClass, type ContextCall } from '@/common/core/commands/context'
import type Entity from '@/common/core/commands/entity'
import type { SlottedComponent } from '@/common/core/slots/slotted-component'
import type DataStore from '@/common/data/data-store'
import type { Entry } from '@/common/utils/types'
import type MultiInputProxy from '@/content/input/multi-input-proxy'
import InputClickDouble from '@/content/input/triggers/click-double'
import ModelScatter from '@/content/model/model-scatter'
import type StateDisplay from '@/content/model/state-display'
import StateEntries from '@/content/model/state-entries'
import GridUpdater from '@/content/view/grid/grid-updater'
import InputRenderer from '@/content/view/InputGlobalRenderer.vue'
import type { Ref } from 'vue'

export default function ({
  gridInputProxy,
  displayState,
  gridUpdater,
  hideFromGrid,
  rows,
  dataStore,
  gridRenderer
}: {
  gridInputProxy: MultiInputProxy
  displayState: StateDisplay
  gridUpdater: GridUpdater
  hideFromGrid: (call: ContextCall, target: Entity) => void
  rows: Ref<number>
  dataStore: DataStore<{ [id: string]: Entry<{ value: string }> }>
  gridRenderer: SlottedComponent<any>
}) {
  const entryCreationContext = new ContextClass<null>()
  const entryContext = new ContextClass<Entry<{ value: string }>>()

  const memoryState = new StateEntries<{ value: string }>(dataStore, entryContext)
  displayState.reader.watchResize(() => {
    blankContext()(memoryState.rebroadcast, {})
  })
  gridRenderer.publishSlot(SlotOverlay, InputRenderer, {
    rows,
    onNewEntry: (event) => {
      entryCreationContext.make(null)(memoryState.addEntry, { entry: { value: event } })
    }
  })

  const scatterInputProxy = gridInputProxy.subset().on(InputClickDouble(), (target) => {
    const call = blankContext()
    hideFromGrid(call, target)
    call(memoryState.removeEntry, { eid: target.uid })
  })

  const scatterModel = new ModelScatter(
    Command.combine<{ x: number; y: number; char: string; owner: Entity }>(
      displayState.setAt.mapArg('owner', ({ owner }) =>
        owner.withInput(scatterInputProxy.acceptor)
      ),
      gridUpdater.setChar,
      gridUpdater.enablePos
    ),
    displayState.reader
  )
  memoryState.onNewEntry.add((call: ContextCall, { entry: { value }, eid }) =>
    call(scatterModel.displayEntry, { entry: value, eid })
  )
  memoryState.onUpdateEntry.add((call: ContextCall, { eid }) =>
    call(scatterModel.updateEntry, { eid })
  )

  return { entryContext, entryCreationContext, memoryState, scatterModel }
}
