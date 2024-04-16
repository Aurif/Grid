import RendererProxy from '@/common/core/renderer-proxy'
import { computed, type Ref } from 'vue'
import GridRenderer from './GridRenderer.vue'

export default class GridRendererProxy extends RendererProxy<typeof GridRenderer> {
  posToChar(x: number, y: number): HTMLSpanElement {
    return this.safeValue.posToChar(x, y)
  }
  spanToPos(span: HTMLElement): [number, number] | undefined {
    if (!this.source.value) return
    return this.source.value.spanToPos(span)
  }
  get parentElement(): Ref<HTMLElement | undefined> {
    return computed(() => {
      if (!this.source.value) return
      return this.source.value.parentElement().value
    })
  }
}
