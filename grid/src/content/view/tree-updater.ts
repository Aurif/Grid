import { command, enableCommandLogging } from '@/common/core/command'
import type { ContextCall } from '@/common/core/context'
import type TreeRendererProxy from './tree-renderer-proxy'

export default class TreeUpdater {
  private proxy: TreeRendererProxy
  constructor(proxy: TreeRendererProxy) {
    this.proxy = proxy
    enableCommandLogging(this)
  }

  setNode = command(
    (_call: ContextCall, { id, degree, layer }: { id: string; degree: number; layer: number }) => {
      this.proxy.positions.value[id] = { degree, layer }
    }
  )
}
