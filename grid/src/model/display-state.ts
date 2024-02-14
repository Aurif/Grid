import { command } from "@/common/command";
import type { Ref } from "vue";
import { watch } from 'vue'

export default class DisplayState {
    state: {[key: string]: string} = {};
    columns: Ref<number>;
    rows: Ref<number>;

    constructor(columns: Ref<number>, rows: Ref<number>) {
        this.columns = columns;
        this.rows = rows;
        watch([columns, rows], () => {
            this.state = {};
        });
    }

    @command
    setAt(x: number, y: number, value: string) {
        this.state[`${x}:${y}`] = value;
    }

    get reader() {
        return new DisplayStateReader(this);
    }
}

export class DisplayStateReader {
    state: DisplayState;

    constructor(state: DisplayState) {
        this.state = state;
    }

    getAt(x: number, y: number) {
        return this.state.state[`${x}:${y}`];
    }

    get columns() { return this.state.columns.value; }
    get rows() { return this.state.rows.value; }
}