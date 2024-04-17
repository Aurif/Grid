import { DormantComponent } from '@/common/core/slots/dormant-component'
import type { VNode } from 'vue'

let currentRoot: DormantComponent<any, any> | undefined = undefined

export function publish(component: DormantComponent<any, any>) {
  currentRoot = component
}

export function renderFunction(): VNode | void {
  if (!currentRoot) return
  return currentRoot.render()
}
