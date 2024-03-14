import { Command } from '@/common/core/command'
import { ContextClass, blankContext, callOnInit, type ContextCall } from '@/common/core/context'
import Entity, { anonymousEntity } from '@/common/core/entity'
import PresetUtil from '@/common/utils/preset-util'
import type { Entry } from '@/common/utils/types'
import type MultiInputProxy from '@/content/input/multi-input-proxy'
import InputClick from '@/content/input/triggers/click'
import InputClickDouble from '@/content/input/triggers/click-double'
import InputClickRight from '@/content/input/triggers/click-right'
import InputScrollDown from '@/content/input/triggers/scroll-down'
import InputScrollUp from '@/content/input/triggers/scroll-up'
import ModelHeader from '@/content/model/model-header'
import { StateCyclic } from '@/content/model/state-cyclic'
import type StateDisplay from '@/content/model/state-display'
import type StateEntries from '@/content/model/state-entries'
import GridUpdater from '@/content/view/grid/grid-updater'

export default function ({
  gridInputProxy,
  gridUpdater,
  displayState,
  entryCreationContext,
  entryContext,
  memoryState,
  hideFromGrid
}: {
  gridInputProxy: MultiInputProxy
  gridUpdater: GridUpdater
  displayState: StateDisplay
  entryCreationContext: ContextClass<null>
  entryContext: ContextClass<Entry<{ value: string }>>
  memoryState: StateEntries<{ value: string }>
  hideFromGrid: (call: ContextCall, target: Entity) => void
}) {
  const timeStages = new PresetUtil([
    { label: 'TODAY', color: '#f98f71', mark: 'day' },
    { label: 'THIS WEEK' },
    { label: 'THIS MONTH', color: '#765c81', mark: 'month' },
    { label: 'NEXT 4 MONTHS', color: '#384456', mark: 'quarter' }
  ])
  const cyclicState = new StateCyclic(timeStages.values)

  const headerEntity = anonymousEntity().withInput(
    gridInputProxy
      .subset()
      .on(InputClick(), () => {
        blankContext()(cyclicState.cycleNext, {})
      })
      .on(InputClickRight(), () => {
        blankContext()(cyclicState.cyclePrev, {})
      })
      .on(InputScrollDown(), () => {
        blankContext()(cyclicState.cycleNext, {})
      })
      .on(InputScrollUp(), () => {
        blankContext()(cyclicState.cyclePrev, {})
      }).acceptor
  )
  const headerModel = new ModelHeader(
    Command.combine(
      displayState.setAt.mapArg('owner', () => headerEntity),
      gridUpdater.setChar,
      gridUpdater.enablePos,
      gridUpdater.setColor.mapArg('color', () => cyclicState.reader.getCurrent('color'))
    ),
    displayState.reader
  )
  cyclicState.listeners.add(
    Command.combine(
      (call: ContextCall) => hideFromGrid(call, headerEntity),
      headerModel.setContent.mapArg('content', ({ value: { label } }) => label)
    )
  )
  callOnInit(headerModel.setContent, { content: cyclicState.reader.getCurrent('label') })

  entryCreationContext.registerModifier(memoryState.addEntry, (command) => {
    if (!cyclicState.reader.getCurrent('mark')) return command
    return command.mapArg('entry', ({ entry }) => ({
      ...entry,
      'time-stage': cyclicState.reader.getCurrent('mark')
    }))
  })

  entryContext.registerModifier(gridUpdater.setChar, (command, context) => {
    return command.addPostCall(
      gridUpdater.setColor.mapArg(
        'color',
        () => timeStages.getBy('mark', context['time-stage']).color
      )
    )
  })

  entryContext.registerModifier(displayState.setAt, (command, context) => {
    if (context['time-stage'] == timeStages.getAt(0).mark) return command
    const modifiedInputProxy = gridInputProxy.subset().on(InputClickDouble(), (target) => {
      const call = blankContext()
      const newStage = timeStages.getAt(
        timeStages.getIndexBy('mark', context['time-stage']) - 1
      ).mark
      call(memoryState.updateEntry, {
        eid: target.uid,
        entry: { ...context, 'time-stage': newStage }
      })
    }).acceptor
    return command.mapArg('owner', ({ owner }) => owner.withInput(modifiedInputProxy))
  })
}
