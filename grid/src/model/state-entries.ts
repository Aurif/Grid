import { command, enableCommandLogging } from "@/common/command";
import { ContextClass, type ContextCall } from "@/common/context";
import Listeners from "@/common/listeners";
import { watch, type Ref } from "vue";

export type Entry = {value: string, [key: string]: any}
export default class StateEntries {
    entries: {[id: string]: Entry} = {};
    readonly onNewEntry = new Listeners<{entry: Entry, eid: string}>()
    readonly onUpdateEntry = new Listeners<{entry: Entry, eid: string}>()
    private contextClass: ContextClass<Entry>
    
    constructor(trigger: Ref | Ref[], contextClass: ContextClass<Entry>) {
        this.contextClass = contextClass
        watch(trigger, () => this.fullListenerBroadcast(), { flush: 'post' });
        enableCommandLogging(this);
    }

    fullListenerBroadcast() {
        for (const eid in this.entries) {
            const call = this.contextClass.make({...this.entries[eid]})
            this.onNewEntry.emit(call, {entry: this.entries[eid], eid})
        }
    }

    addEntry = command((call: ContextCall, {entry}: {entry: Entry}) => {
        const eid = ''+Date.now()
        this.entries[eid] = entry;
        const newCall = this.contextClass.make({...entry})
        this.onNewEntry.emit(newCall, {entry, eid})
    })

    updateEntry = command((call: ContextCall, {entry, eid}: {entry: Entry, eid: string}) => {
        if (!this.entries[eid]) throw new Error('Tried updating non-existent entry');
        this.entries[eid] = entry;
        const newCall = this.contextClass.make({...entry})
        this.onUpdateEntry.emit(newCall, {entry, eid})
    })

    removeEntry = command((_call: ContextCall, {eid}: {eid: string}) => {
        if (!this.entries[eid]) throw Error("Tried removing non-existent entry "+eid)
        delete this.entries[eid]
    })
}