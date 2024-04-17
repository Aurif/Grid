import { command, enableCommandLogging } from '@/common/core/commands/command'
import { ContextClass, blankContext, type ContextCall } from '@/common/core/commands/context'
import Listeners from '@/common/core/commands/listeners'
import type DataStore from '@/common/data/data-store'
import type { Entry } from '@/common/utils/types'

export default class StateEntries<E extends {}> {
  public readonly onNewEntry = new Listeners<{ entry: Entry<E>; eid: string }>()
  public readonly onUpdateEntry = new Listeners<{ entry: Entry<E>; eid: string }>()
  public readonly onUpdateData = new Listeners<{ data: { [id: string]: Entry<E> } }>()
  rebroadcast = command(() => {
    this.fullListenerBroadcast(this.onNewEntry.emit.bind(this.onNewEntry))
  })

  private readonly entries: { [id: string]: Entry<E> }
  removeEntry = command((_call: ContextCall, { eid }: { eid: string }) => {
    if (!this.entries[eid]) throw Error('Tried removing non-existent entry ' + eid)
    delete this.entries[eid]
    this.onUpdateData.emit(blankContext(), { data: { ...this.entries } })
  })

  private readonly contextClass: ContextClass<Entry<E>>
  addEntry = command((_call: ContextCall, { entry }: { entry: Entry<E> }) => {
    const eid = '' + Date.now()
    this.entries[eid] = entry
    const newCall = this.contextClass.make({ ...entry })
    this.onNewEntry.emit(newCall, { entry, eid })
    this.onUpdateData.emit(newCall, { data: { ...this.entries } })
  })

  updateEntry = command((_call: ContextCall, { entry, eid }: { entry: Entry<E>; eid: string }) => {
    if (!this.entries[eid]) throw new Error('Tried updating non-existent entry')
    this.entries[eid] = entry
    const newCall = this.contextClass.make({ ...entry })
    this.onUpdateEntry.emit(newCall, { entry, eid })
    this.onUpdateData.emit(newCall, { data: { ...this.entries } })
  })

  constructor(
    dataStore: DataStore<{ [id: string]: Entry<E> }>,
    contextClass: ContextClass<Entry<E>>
  ) {
    this.contextClass = contextClass
    this.entries = dataStore.hook
    this.onNewEntry.onNewListenerAdded = (listener) => {
      this.fullListenerBroadcast((call, data) => call(listener, data))
    }
    this.onUpdateData.onNewListenerAdded = (listener) => {
      blankContext()(listener, { data: this.entries })
    }
    enableCommandLogging(this)
  }

  get reader(): StateEntriesReader<E> {
    return new StateEntriesReader(this)
  }

  fullListenerBroadcast(
    broadcast: (call: ContextCall, data: { entry: Entry<E>; eid: string }) => void
  ) {
    for (const eid in this.entries) {
      const call = this.contextClass.make({ ...this.entries[eid] })
      broadcast(call, { entry: this.entries[eid], eid })
    }
  }
}

export class StateEntriesReader<E extends {}> {
  private state: StateEntries<E>

  constructor(state: StateEntries<E>) {
    this.state = state
  }

  get entries() {
    return { ...this.state['entries'] }
  }

  get(eid: string) {
    return this.entries[eid]
  }
}
