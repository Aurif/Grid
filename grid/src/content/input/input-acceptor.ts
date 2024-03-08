import type Entity from '@/common/core/entity'
import type Input from './input'

export default class InputAcceptor {
  actions: { [input: string]: ((target: Entity) => void)[] } = {}
  on(input: Input, action: (target: Entity) => void): this {
    let key = input.uid
    if (!this.actions[key]) this.actions[key] = []
    this.actions[key].push(action)

    return this
  }
  trigger(input: Input, target: Entity) {
    for (let action of this.actions[input.uid] || []) action(target)
  }
  spawn(owner: Entity): InputAcceptorSpawn {
    return new InputAcceptorSpawn(this, owner)
  }
}

class InputAcceptorSpawn {
  private parent: InputAcceptor
  owner: Entity

  constructor(parent: InputAcceptor, owner: Entity) {
    this.parent = parent
    this.owner = owner
  }
  trigger(input: Input) {
    this.parent.trigger(input, this.owner)
  }
}
export type { InputAcceptorSpawn }
