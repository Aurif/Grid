import RendererProxy from '@/common/core/renderer-proxy'
import GridRenderer from './GridRenderer.vue'

export default class GridRendererProxy extends RendererProxy<typeof GridRenderer> {
  posToChar(x: number, y: number): HTMLSpanElement {
    return this.safeValue.posToChar(x, y)
  }
  spanToPos(span: HTMLElement): [number, number] | undefined {
    if (!this.source.value) return
    return this.source.value.spanToPos(span)
  }
}
