import type { ContextCall } from '@/common/context'
import type Entity from '@/common/entity'
import type { ComponentRef } from '@/common/types'
import MultiInputProxy from '@/input/multi-input-proxy'
import { determinePositioning } from '@/input/positioning'
import StateDisplay from '@/model/state-display'
import GridRendererProxy from '@/view/grid-renderer-proxy'
import GridUpdater from '@/view/grid-updater'
import GridRenderer from '@/view/GridRenderer.vue'

export default function ({ gridRenderer }: { gridRenderer: ComponentRef<typeof GridRenderer> }) {
  const { rows, columns } = determinePositioning()
  const displayState = new StateDisplay(rows, columns)

  const gridRendererProxy = new GridRendererProxy(gridRenderer)
  const gridUpdater = new GridUpdater(gridRendererProxy)

  const gridInputProxy = new MultiInputProxy((el) => {
    const pos = gridRendererProxy.spanToPos(el)
    if (!pos) return
    const owners = displayState.reader.getOwnersAt(...pos)
    if (owners.length == 1) return owners[0].inputAcceptor
  })

  function hideFromGrid(call: ContextCall, target: Entity) {
    const otherLetters = displayState.reader.getOwnedBy(target)
    for (const pos of otherLetters) {
      call(displayState.removeAt, { ...pos, owner: target })
      if (displayState.reader.getOwnersAt(pos.x, pos.y).length == 0)
        call(gridUpdater.disablePos, pos)
    }
  }

  return {
    displayState,
    gridRendererProxy,
    gridUpdater,
    gridInputProxy,
    hideFromGrid,
    rows,
    columns
  }
}
