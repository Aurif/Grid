import RendererProxy from '@/common/core/renderer-proxy'
import type { Ref } from 'vue'
import type TreeRenderer from './TreeRenderer.vue'

export default class TreeRendererProxy extends RendererProxy<typeof TreeRenderer> {
  get positions(): Ref<{ [id: string]: { degree: number; layer: number } }> {
    return this.safeValue.positions()
  }
}
