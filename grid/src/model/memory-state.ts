import { command } from "@/common/command";
import { watch, type Ref } from "vue";

export default class MemoryState {
    entries: {[id: string]: string} = {};
    listeners: ((entry: string, owner: string) => void)[];
    
    constructor(trigger: Ref | Ref[], listeners: ((entry: string, owner: string) => void)[]) {
        this.listeners = listeners;
        watch(trigger, () => this.fullListenerBroadcast(), { flush: 'post' });
    }

    fullListenerBroadcast() {
        for (let eid in this.entries) {
            for (let listener of this.listeners) {
                listener(this.entries[eid], eid);
            }
        }
    }

    @command
    addEntry(entry: string) {
        let eid = ''+Date.now()
        this.entries[eid] = entry;
        for (let listener of this.listeners) {
            listener(entry, eid);
        }
    }
}