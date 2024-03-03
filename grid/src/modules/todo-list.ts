import { Command } from '@/common/command'
import { ContextClass, blankContext, type ContextCall } from '@/common/context'
import type Entity from '@/common/entity'
import type MultiInputProxy from '@/input/multi-input-proxy'
import InputClickDouble from '@/input/triggers/click-double'
import ModelScatter from '@/model/model-scatter'
import type StateDisplay from '@/model/state-display'
import type { Entry } from '@/model/state-entries'
import StateEntriesGist from '@/model/state-entries-gist'
import GridUpdater from '@/view/grid-updater'
import type { Ref } from 'vue'

export default function ({
  gridInputProxy,
  displayState,
  gridUpdater,
  hideFromGrid,
  columns,
  rows
}: {
  gridInputProxy: MultiInputProxy
  displayState: StateDisplay
  gridUpdater: GridUpdater
  hideFromGrid: (call: ContextCall, target: Entity) => void
  columns: Ref<number>
  rows: Ref<number>
}) {
  const entryCreationContext = new ContextClass<null>()
  const entryContext = new ContextClass<Entry>()

  const memoryState = new StateEntriesGist([columns, rows], entryContext) //TODO: handle this properly
  const scatterInputProxy = gridInputProxy.subset().on(InputClickDouble(), (target) => {
    const call = blankContext()
    hideFromGrid(call, target)
    call(memoryState.removeEntry, { eid: target.uid })
  })

  const scatterModel = new ModelScatter(
    Command.combine<{ x: number; y: number; char: string; owner: Entity }>(
      gridUpdater.setChar,
      gridUpdater.enablePos,
      displayState.setAt.mapArg('owner', ({ owner }) => owner.withInput(scatterInputProxy.acceptor))
    ),
    displayState.reader
  )
  memoryState.onNewEntry.add((call: ContextCall, { entry: { value }, eid }) =>
    call(scatterModel.displayEntry, { entry: value, eid })
  )
  memoryState.onUpdateEntry.add((call: ContextCall, { eid }) =>
    call(scatterModel.updateEntry, { eid })
  )

  return { entryContext, entryCreationContext, memoryState }
}
