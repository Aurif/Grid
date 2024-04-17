import type { DelayedRef } from '@/common/utils/delayed-ref'
import type { Component, ComponentInstance, Ref } from 'vue'

export type ComponentRef<C extends Component<any>> = Ref<ComponentInstance<C>>
export type DelayedComponentRef<C extends Component<any>> = DelayedRef<ComponentInstance<C>>
export type Entry<E extends {}> = E & { [key: string]: any }
