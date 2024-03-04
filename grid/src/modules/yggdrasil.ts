import { Command } from '@/common/command'
import { blankContext } from '@/common/context'
import { anonymousEntity } from '@/common/entity'
import ModelCorner from '@/model/model-corner'
import type StateDisplay from '@/model/state-display'
import type GridUpdater from '@/view/grid-updater'

export default function ({
  displayState,
  gridUpdater
}: {
  displayState: StateDisplay
  gridUpdater: GridUpdater
}) {
  const cornerDisplayEntity = anonymousEntity()
  const cornerModel = new ModelCorner(
    Command.combine(
      gridUpdater.setChar,
      gridUpdater.enablePos,
      gridUpdater.setColor.mapArg('color', () => '#ffffff'),
      displayState.setAt.mapArg('owner', () => cornerDisplayEntity)
    ),
    displayState.reader
  )

  setTimeout(() => {
    blankContext()(cornerModel.displayEntry, { entry: 'Hi!' })
    blankContext()(cornerModel.displayEntry, { entry: 'Hello!' })
  }, 1)
}
