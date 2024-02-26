import { Command, command, enableCommandLogging } from "@/common/command";
import { blankContext, type ContextCall } from "@/common/context";
import { watch, type Ref } from "vue";

export default class StateEntries {
    entries: {[id: string]: string} = {};
    listeners: Command<[entry: string, owner: string]>[] = [];
    
    constructor(trigger: Ref | Ref[]) {
        watch(trigger, () => this.fullListenerBroadcast(), { flush: 'post' });
        enableCommandLogging(this);
    }

    addListener(listener: Command<[entry: string, owner: string]>) {
        this.listeners.push(listener)
    }

    fullListenerBroadcast() {
        const call = blankContext()
        for (const eid in this.entries) {
            for (const listener of this.listeners) {
                call(listener, this.entries[eid], eid);
            }
        }
    }

    addEntry = command((call: ContextCall, entry: string) => {
        const eid = ''+Date.now()
        this.entries[eid] = entry;
        for (const listener of this.listeners) {
            call(listener, entry, eid);
        }
    })

    removeEntry = command((_call: ContextCall, eid: string) => {
        if (!this.entries[eid]) throw Error("Tried removing non-existent entry "+eid)
        delete this.entries[eid]
    })
}