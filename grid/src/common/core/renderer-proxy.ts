import type { Component } from 'vue'
import type { ComponentRef } from '../utils/types'

export default class RendererProxy<T extends Component<any>> {
  protected readonly source: ComponentRef<T>

  constructor(bind: ComponentRef<T>) {
    this.source = bind
  }

  protected get safeValue() {
    if (!this.source.value)
      throw Error(`Tried accessing renderer from ${this.constructor.name} before it is bound`)
    return this.source.value
  }
}
