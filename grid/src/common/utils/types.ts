import type { Ref } from 'vue'

export type ComponentRef<C extends abstract new (...args: any) => any> = Ref<InstanceType<C>>
export type Entry<E extends {}> = E & { [key: string]: any }
