import { command, enableCommandLogging } from "@/common/command";
import { blankContext, type ContextCall } from "@/common/context";
import Listeners from "@/common/listeners";
import { watch, type Ref } from "vue";

export default class StateEntries {
    entries: {[id: string]: string} = {};
    readonly listeners = new Listeners<[entry: string, owner: string]>()
    
    constructor(trigger: Ref | Ref[]) {
        watch(trigger, () => this.fullListenerBroadcast(), { flush: 'post' });
        enableCommandLogging(this);
    }

    fullListenerBroadcast() {
        const call = blankContext()
        for (const eid in this.entries) {
            this.listeners.emit(call, this.entries[eid], eid)
        }
    }

    addEntry = command((call: ContextCall, entry: string) => {
        const eid = ''+Date.now()
        this.entries[eid] = entry;
        this.listeners.emit(call, entry, eid)
    })

    removeEntry = command((_call: ContextCall, eid: string) => {
        if (!this.entries[eid]) throw Error("Tried removing non-existent entry "+eid)
        delete this.entries[eid]
    })
}