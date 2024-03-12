import { command, enableCommandLogging } from '@/common/core/command'
import type { ContextCall } from '@/common/core/context'
import type TreeRendererProxy from './tree-renderer-proxy'

export default class TreeUpdater {
  private proxy: TreeRendererProxy
  setNode = command(
    (
      _call: ContextCall,
      { id, degree, layer, parent }: { id: string; degree: number; layer: number; parent?: string }
    ) => {
      this.proxy.positions.value[id] = { degree, layer, parent }
    }
  )
  focusNode = command((_call: ContextCall, { nodeId }: { nodeId: string }) => {
    const element = this.proxy.idToElement(nodeId)
    if (!element) throw Error('Tried to focus non-existent node')
    element.classList.add('active')
  })
  unfocusNode = command((_call: ContextCall, { nodeId }: { nodeId: string }) => {
    const element = this.proxy.idToElement(nodeId)
    if (!element) throw Error('Tried to focus non-existent node')
    element.classList.remove('active')
  })

  constructor(proxy: TreeRendererProxy) {
    this.proxy = proxy
    enableCommandLogging(this)
  }
}
