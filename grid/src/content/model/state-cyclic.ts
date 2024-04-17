import { command, enableCommandLogging } from '@/common/core/commands/command'
import type { ContextCall } from '@/common/core/commands/context'
import Listeners from '@/common/core/commands/listeners'

export class StateCyclic<T extends {}> {
  readonly listeners = new Listeners<{ value: T }>()
  private values: T[]
  private index: number = 0
  cycleNext = command((call: ContextCall) => {
    this.index = (this.index + 1) % this.values.length
    this.listeners.emit(call, { value: { ...this.values[this.index] } })
  })
  cyclePrev = command((call: ContextCall) => {
    this.index = (this.index - 1 + this.values.length) % this.values.length
    this.listeners.emit(call, { value: { ...this.values[this.index] } })
  })

  constructor(values: T[]) {
    this.values = values
    enableCommandLogging(this)
  }

  get reader(): StateCyclicReader<T> {
    return new StateCyclicReader(this)
  }
}

class StateCyclicReader<T extends {}> {
  private state: StateCyclic<T>

  constructor(state: StateCyclic<T>) {
    this.state = state
  }

  getCurrent<K extends keyof T>(key: K): T[K] {
    return this.state['values'][this.state['index']][key]
  }
}
