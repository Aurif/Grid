import type { ComponentParams } from '@/common/utils/types'
import type { Component, ComponentInstance, Ref, VNode } from 'vue'
import { h, ref } from 'vue'

export class SlottedComponent<C extends Component<any>> {
  public readonly ref: Ref<ComponentInstance<C> | undefined>
  public render: () => VNode

  private constructor(component: C, params: ComponentParams<C>) {
    this.ref = ref(undefined) as Ref<ComponentInstance<C> | undefined>
    const unboundRef = this.ref
    this.render = () => {
      return h(component, {
        ...params,
        ref: (el: ComponentInstance<C>) => {
          unboundRef.value = el as any
        }
      })
    }
  }

  public publishSlot<Cn extends Component<any>>(
    slot: Component<{}>,
    component: Cn,
    params: ComponentParams<Cn>
  ): SlottedComponent<Cn> {
    const newComponent = new SlottedComponent(component, params)
    const unboundRender = this.render
    this.render = () => {
      return h(slot, null, {
        base: unboundRender,
        newer: newComponent.render
      })
    }
    return newComponent
  }
}
