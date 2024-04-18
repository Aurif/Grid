import { SlottedComponent } from '@/common/core/slots/slotted-component'
import type { ComponentParams } from '@/common/utils/types'
import type { Component, VNode } from 'vue'

let rootSlot: SlottedComponent<any> | undefined = undefined

export function publishRootSlot<C extends Component<any>>(
  component: C,
  parameters: ComponentParams<C>
): SlottedComponent<C> {
  if (rootSlot) throw Error('Cannot publish a second root slot')
  rootSlot = new (SlottedComponent as any)(component, parameters) as SlottedComponent<C>
  return rootSlot
}

export function renderFunction(): VNode | void {
  if (!rootSlot) return
  return rootSlot.render()
}
