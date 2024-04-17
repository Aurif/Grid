import type { Component, ComponentInstance, Ref, VNode } from 'vue'
import { h, ref } from 'vue'

export class DormantComponent<C extends Component<P>, P> {
  public readonly ref: Ref<ComponentInstance<C> | undefined>
  private readonly component: C
  private readonly params: P

  constructor(component: C, params: P) {
    this.ref = ref(undefined) as Ref<ComponentInstance<C> | undefined>
    this.component = component
    this.params = params
  }

  public render(): VNode {
    return h(this.component, {
      ...this.params,
      ref: (el) => {
        this.ref.value = el as any
      }
    })
  }
}
