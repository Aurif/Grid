import { Command } from '@/common/core/command'
import { ContextClass, blankContext } from '@/common/core/context'
import { anonymousEntity } from '@/common/core/entity'
import type MultiInputProxy from '@/content/input/multi-input-proxy'
import InputClickDouble from '@/content/input/triggers/click-double'
import ModelCorner from '@/content/model/model-corner'
import type ModelScatter from '@/content/model/model-scatter'
import type StateDisplay from '@/content/model/state-display'
import type { Entry } from '@/content/model/state-entries'
import type GridUpdater from '@/content/view/grid-updater'
import { type Ref } from 'vue'

export default function ({
  displayState,
  gridUpdater,
  entryContext,
  scatterModel,
  gridInputProxy,
  pageControl
}: {
  displayState: StateDisplay
  gridUpdater: GridUpdater
  entryContext: ContextClass<Entry>
  scatterModel: ModelScatter
  gridInputProxy: MultiInputProxy
  pageControl: Ref<boolean>
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

  const cache = new Set()
  entryContext.registerModifier(scatterModel.displayEntry, (command, context) => {
    if (context['time-stage'] != 'goal') return command
    if (cache.has(context.value)) return
    cache.add(context.value)
    blankContext()(cornerModel.displayEntry, { entry: context.value })
  })
}
