import type { ComponentRef } from '@/common/utils/types'
import type { Ref } from 'vue'
import type TreeRenderer from './TreeRenderer.vue'

export default class TreeRendererProxy {
  source: ComponentRef<typeof TreeRenderer>

  constructor(bind: ComponentRef<typeof TreeRenderer>) {
    this.source = bind
  }

  get positions(): Ref<{ [id: string]: { degree: number; layer: number } }> {
    if (!this.source.value) throw Error('Tried accessing renderer before it is bound')
    return this.source.value.positions()
  }
}
