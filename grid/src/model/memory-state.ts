import { Command, command, enableCommandLogging } from "@/common/command";
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
        for (let eid in this.entries) {
            for (let listener of this.listeners) {
                listener.call(this.entries[eid], eid);
            }
        }
    }

    addEntry = command((entry: string) => {
        let eid = ''+Date.now()
        this.entries[eid] = entry;
        for (let listener of this.listeners) {
            listener.call(entry, eid);
        }
    })

    removeEntry = command((eid: string) => {
        if (!this.entries[eid]) throw Error("Tried removing non-existent entry "+eid)
        delete this.entries[eid]
    })
}