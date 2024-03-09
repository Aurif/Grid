import { onBeforeUnmount } from 'vue'

export default function singleton<C>(constructor: { new (): C }): () => C {
  let instance: C | undefined
  return function inner(this: any): C {
    if (!instance) {
      instance = new constructor()
      onBeforeUnmount(() => {
        instance = undefined
      })
    }
    return instance
  }
}
