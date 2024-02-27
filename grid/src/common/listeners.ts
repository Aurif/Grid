import { Command, type CommandArguments, type CommandLike } from "./command";
import type { ContextCall } from "./context";

export default class Listeners<A extends CommandArguments> {
    private listeners: Command<A>[] = [];
    add(listener: CommandLike<A>) {
        if (!(listener instanceof Command)) listener = new Command([listener])
        this.listeners.push(listener)
    }
    emit(call: ContextCall, args: A) {
        for (const listener of this.listeners) {
            call(listener, args);
        }
    }
}