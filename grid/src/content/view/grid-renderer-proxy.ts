import type { ComponentRef } from '@/common/utils/types'
import GridRenderer from './GridRenderer.vue'

export default class GridRendererProxy {
  source: ComponentRef<typeof GridRenderer>

  constructor(bind: ComponentRef<typeof GridRenderer>) {
    this.source = bind
  }

  posToChar(x: number, y: number): HTMLSpanElement {
    if (!this.source.value) throw Error('Tried accessing renderer before it is bound')
    return this.source.value.posToChar(x, y)
  }
  spanToPos(span: HTMLElement): [number, number] | undefined {
    if (!this.source.value) return
    return this.source.value.spanToPos(span)
  }
}
