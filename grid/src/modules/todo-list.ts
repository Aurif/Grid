import { Command } from '@/common/core/command'
import { ContextClass, blankContext, type ContextCall } from '@/common/core/context'
import type Entity from '@/common/core/entity'
import type DataStore from '@/common/data/data-store'
import type MultiInputProxy from '@/content/input/multi-input-proxy'
import InputClickDouble from '@/content/input/triggers/click-double'
import ModelScatter from '@/content/model/model-scatter'
import type StateDisplay from '@/content/model/state-display'
import type { Entry } from '@/content/model/state-entries'
import StateEntries from '@/content/model/state-entries'
import GridUpdater from '@/content/view/grid-updater'
import type { Ref } from 'vue'

export default function ({
  gridInputProxy,
  displayState,
  gridUpdater,
  hideFromGrid,
  dataStore
}: {
  gridInputProxy: MultiInputProxy
  displayState: StateDisplay
  gridUpdater: GridUpdater
  hideFromGrid: (call: ContextCall, target: Entity) => void
  columns: Ref<number>
  rows: Ref<number>
  dataStore: DataStore<{ [id: string]: Entry }>
}) {
  const entryCreationContext = new ContextClass<null>()
  const entryContext = new ContextClass<Entry>()

  const memoryState = new StateEntries(dataStore, entryContext)
  displayState.reader.watchResize(() => {
    blankContext()(memoryState.rebroadcast, {})
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
