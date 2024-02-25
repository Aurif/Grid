import { Command, command, enableCommandLogging } from "@/common/command";
import { blankContext, type ContextCall } from "@/common/context";
import { watch, type Ref } from "vue";

export default class MemoryState {
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
        let call = blankContext()
        for (let eid in this.entries) {
            for (let listener of this.listeners) {
                call(listener, this.entries[eid], eid);
            }
        }
    }

    addEntry = command((call: ContextCall, entry: string) => {
        let eid = ''+Date.now()
        this.entries[eid] = entry;
        for (let listener of this.listeners) {
            call(listener, entry, eid);
        }
    })

    removeEntry = command((_call: ContextCall, eid: string) => {
        if (!this.entries[eid]) throw Error("Tried removing non-existent entry "+eid)
        delete this.entries[eid]
    })
}