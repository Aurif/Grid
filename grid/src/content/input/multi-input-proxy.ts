import type Entity from '@/common/core/entity'
import type Input from './input'
import type { InputAcceptorSpawn } from './input-acceptor'
import InputAcceptor from './input-acceptor'

export default class MultiInputProxy {
  private mapping: (element: HTMLElement) => InputAcceptorSpawn | undefined
  private inputUidCache: Set<string> = new Set()

  constructor(mapping: (element: HTMLElement) => InputAcceptorSpawn | undefined) {
    this.mapping = mapping
  }

  bindMapping(input: Input) {
    if (!this.inputUidCache.has(input.uid)) {
      input.addListener((el) => {
        const target = this.mapping(el)
        target?.trigger(input)
        return !!target
      })
      this.inputUidCache.add(input.uid)
    }
  }

  subset(): MultiInputProxySubset {
    return new MultiInputProxySubset(this)
  }
}

class MultiInputProxySubset {
  private fullset: MultiInputProxy
  readonly acceptor: InputAcceptor = new InputAcceptor()
  constructor(fullset: MultiInputProxy) {
    this.fullset = fullset
  }

  on(input: Input, action: (target: Entity) => void): this {
    this.fullset.bindMapping(input)
    this.acceptor.on(input, action)
    return this
  }
}
