import { command } from "@/common/command";
import type { InputAcceptorSpawn } from "@/input/input-acceptor";
import type { Ref } from "vue";
import { watch } from 'vue'

export default class DisplayState {
    state: {[key: string]: {value: string, inputAcceptor: InputAcceptorSpawn}} = {};
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
    setAt(x: number, y: number, value: string, inputAcceptor: InputAcceptorSpawn) {
        this.state[`${x}:${y}`] = {value, inputAcceptor}
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

    getAt(x: number, y: number): string | undefined {
        return this.state.state[`${x}:${y}`]?.value;
    }

    getInputAcceptorAt(x: number, y: number): InputAcceptorSpawn | undefined {
        return this.state.state[`${x}:${y}`]?.inputAcceptor;
    }

    get columns() { return this.state.columns.value; }
    get rows() { return this.state.rows.value; }
}