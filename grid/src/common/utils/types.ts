import type { DelayedRef } from '@/common/utils/delayed-ref'
import type { AllowedComponentProps, Component, ComponentInstance, Ref, VNodeProps } from 'vue'

export type ComponentRef<C extends Component<any>> = Ref<ComponentInstance<C>>
export type DelayedComponentRef<C extends Component<any>> = DelayedRef<ComponentInstance<C>>
export type Entry<E extends {}> = E & { [key: string]: any }
export type ComponentParams<C extends Component> = C extends new (...args: any) => any
  ? Omit<InstanceType<C>['$props'], keyof VNodeProps | keyof AllowedComponentProps>
  : never
