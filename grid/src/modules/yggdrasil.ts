import { Command } from '@/common/command'
import { ContextClass, blankContext } from '@/common/context'
import { anonymousEntity } from '@/common/entity'
import ModelCorner from '@/model/model-corner'
import type ModelScatter from '@/model/model-scatter'
import type StateDisplay from '@/model/state-display'
import type { Entry } from '@/model/state-entries'
import type GridUpdater from '@/view/grid-updater'

export default function ({
  displayState,
  gridUpdater,
  entryContext,
  scatterModel
}: {
  displayState: StateDisplay
  gridUpdater: GridUpdater
  entryContext: ContextClass<Entry>
  scatterModel: ModelScatter
}) {
  const cornerDisplayEntity = anonymousEntity()
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

  const cache = new Set()
  entryContext.registerModifier(scatterModel.displayEntry, (command, context) => {
    if (context['time-stage'] != 'goal') return command
    if (cache.has(context.value)) return
    cache.add(context.value)
    blankContext()(cornerModel.displayEntry, { entry: context.value })
  })
}
