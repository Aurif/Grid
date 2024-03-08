import { command, enableCommandLogging } from '@/common/core/command'
import { ContextClass, type ContextCall } from '@/common/core/context'
import Listeners from '@/common/core/listeners'
import type DataStore from '@/common/data/data-store'

export type Entry = { value: string; [key: string]: any }
export default class StateEntries {
  entries: { [id: string]: Entry }
  readonly onNewEntry = new Listeners<{ entry: Entry; eid: string }>()
  readonly onUpdateEntry = new Listeners<{ entry: Entry; eid: string }>()
  private contextClass: ContextClass<Entry>

  constructor(dataStore: DataStore<{ [id: string]: Entry }>, contextClass: ContextClass<Entry>) {
    this.contextClass = contextClass
    this.entries = dataStore.hook
    this.onNewEntry.onNewListenerAdded = (listener) => {
      this.fullListenerBroadcast((call, data) => call(listener, data))
    }
    enableCommandLogging(this)
  }

  fullListenerBroadcast(
    broadcast: (call: ContextCall, data: { entry: Entry; eid: string }) => void
  ) {
    for (const eid in this.entries) {
      const call = this.contextClass.make({ ...this.entries[eid] })
      broadcast(call, { entry: this.entries[eid], eid })
    }
  }

  addEntry = command((_call: ContextCall, { entry }: { entry: Entry }) => {
    const eid = '' + Date.now()
    this.entries[eid] = entry
    const newCall = this.contextClass.make({ ...entry })
    this.onNewEntry.emit(newCall, { entry, eid })
  })

  updateEntry = command((_call: ContextCall, { entry, eid }: { entry: Entry; eid: string }) => {
    if (!this.entries[eid]) throw new Error('Tried updating non-existent entry')
    this.entries[eid] = entry
    const newCall = this.contextClass.make({ ...entry })
    this.onUpdateEntry.emit(newCall, { entry, eid })
  })

  removeEntry = command((_call: ContextCall, { eid }: { eid: string }) => {
    if (!this.entries[eid]) throw Error('Tried removing non-existent entry ' + eid)
    delete this.entries[eid]
  })

  rebroadcast = command(() => {
    this.fullListenerBroadcast(this.onNewEntry.emit.bind(this.onNewEntry))
  })
}
