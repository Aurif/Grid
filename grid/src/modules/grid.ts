import type { ContextCall } from '@/common/core/context'
import type Entity from '@/common/core/entity'
import type { ComponentRef } from '@/common/utils/types'
import MultiInputProxy from '@/content/input/multi-input-proxy'
import { determinePositioning } from '@/content/input/positioning'
import StateDisplay from '@/content/model/state-display'
import GridRenderer from '@/content/view/grid/GridRenderer.vue'
import GridRendererProxy from '@/content/view/grid/grid-renderer-proxy'
import GridUpdater from '@/content/view/grid/grid-updater'

export default function ({ gridRenderer }: { gridRenderer: ComponentRef<typeof GridRenderer> }) {
  const gridRendererProxy = new GridRendererProxy(gridRenderer)
  const gridUpdater = new GridUpdater(gridRendererProxy)
  const { rows, columns } = determinePositioning(gridRendererProxy.parentElement)
  const displayState = new StateDisplay(rows, columns)

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
