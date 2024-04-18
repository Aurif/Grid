import BlankComponent from '@/common/components/BlankComponent.vue'
import SlotSidebar from '@/common/components/slots/SlotSidebar.vue'
import type { SlottedComponent } from '@/common/core/slots/slotted-component'

export default function ({ gridRenderer }: { gridRenderer: SlottedComponent<any> }) {
  gridRenderer.publishSlot(SlotSidebar, BlankComponent, {})

  return {}
}
