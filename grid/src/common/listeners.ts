import type { Command } from "./command";
import type { ContextCall } from "./context";

export default class Listeners<A extends any[]> {
    private listeners: Command<A>[] = [];
    add(listener: Command<A>) {
        this.listeners.push(listener)
    }
    emit(call: ContextCall, ...args: A) {
        for (const listener of this.listeners) {
            call(listener, ...args);
        }
    }
}