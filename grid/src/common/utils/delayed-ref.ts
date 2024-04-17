import type { Ref } from 'vue'
import { ref } from 'vue'

export type DelayedRef<T> = Ref<T> & DelayedRefImplementation<T>

class DelayedRefImplementation<T> {
  private currentGetter: Ref<() => T>

  constructor(value?: T) {
    this.currentGetter = ref(() => value) as Ref<() => T>
  }

  get value(): T {
    return this.currentGetter.value()
  }

  set value(value: T) {
    throw new Error('A delayed ref cannot be updated')
  }

  bind(newRef: Ref<T>) {
    this.currentGetter.value = () => {
      return newRef.value
    }
  }
}

export default function delayedRef<T>(value?: T): DelayedRef<T> {
  return new DelayedRefImplementation(value) as unknown as DelayedRef<T>
}
