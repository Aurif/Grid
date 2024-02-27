import { command, enableCommandLogging } from "@/common/command";
import type { ContextCall } from "@/common/context";
import Listeners from "@/common/listeners";

export class StateCyclic<T extends {}> {
    private values: T[];
    private index: number = 0;
    readonly listeners = new Listeners<{value: T}>();

    constructor(values: T[]) {
        this.values = values
        enableCommandLogging(this)
    }

    cycleNext = command((call: ContextCall) => {
        this.index = (this.index+1)%this.values.length
        this.listeners.emit(call, {value: {...this.values[this.index]}})
    })

    get reader() {
        return new StateCyclicReader(this);
    }
}

class StateCyclicReader<T extends {}> {
    private state: StateCyclic<T>;
    constructor(state: StateCyclic<T>) {
        this.state = state;
    }

    getCurrent<K extends keyof T>(key: K): T[K] {
        return this.state['values'][this.state['index']][key]
    }
}