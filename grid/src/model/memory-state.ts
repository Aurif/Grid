import { command } from "@/common/command";
import { watch, type Ref } from "vue";

export default class MemoryState {
    entries: string[] = [];
    listeners: ((entry: string) => void)[];
    
    constructor(trigger: Ref | Ref[], listeners: ((entry: string) => void)[]) {
        this.listeners = listeners;
        watch(trigger, () => {
            for (let entry of this.entries) {
                for (let listener of this.listeners) {
                    listener(entry);
                }
            }
        }, { flush: 'post' });
    }

    @command
    addEntry(entry: string) {
        this.entries.push(entry);
        for (let listener of this.listeners) {
            listener(entry);
        }
    }
}