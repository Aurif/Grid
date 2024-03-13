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
    if (!element) throw Error('Tried to unfocus non-existent node')
    element.classList.remove('active')
  })
  setColor = command(
    (_call: ContextCall, { nodeId, color }: { nodeId: string; color?: string }) => {
      const element = this.proxy.idToElement(nodeId)
      if (!element) throw Error('Tried to change color of non-existent node')
      const elementLine = this.proxy.idToLineElement(nodeId)
      if (!elementLine) throw Error("Line doesn't exist for node, renderer is considered corrupted")

      if (!color) {
        element.style.removeProperty('stroke')
        elementLine.style.removeProperty('stroke')
      } else {
        element.style.setProperty('stroke', color)
        elementLine.style.setProperty('stroke', color)
      }
    }
  )
  setNodeStyle = command(
    (_call: ContextCall, { nodeId, style }: { nodeId: string; style?: string }) => {
      const element = this.proxy.idToElement(nodeId)
      if (!element) throw Error('Tried to change color of non-existent node')
      if (!style) element.removeAttribute('nodeStyle')
      else element.setAttribute('nodeStyle', style)
    }
  )

  constructor(proxy: TreeRendererProxy) {
    this.proxy = proxy
    enableCommandLogging(this)
  }
}
