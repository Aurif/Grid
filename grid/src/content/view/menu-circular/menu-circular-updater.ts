import { command, enableCommandLogging } from '@/common/core/command'
import type { ContextCall } from '@/common/core/context'
import type MenuCircularRendererProxy from '@/content/view/menu-circular/menu-circular-renderer-proxy'

export default class MenuCircularUpdater {
  private proxy: MenuCircularRendererProxy
  enableArc = command((_call: ContextCall, { segment }: { segment: number }) => {
    const arc = this.proxy.segmentToArc(segment)
    arc.classList.add('active')
  })
  disableArc = command((_call: ContextCall, { segment }: { segment: number }) => {
    const arc = this.proxy.segmentToArc(segment)
    arc.classList.remove('active')
  })

  constructor(proxy: MenuCircularRendererProxy) {
    this.proxy = proxy
    enableCommandLogging(this)
  }
}
