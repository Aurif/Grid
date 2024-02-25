import { command, enableCommandLogging } from "@/common/command";
import type Entity from "@/common/entity";
import type { Ref } from "vue";
import { watch } from 'vue'

export default class DisplayState {
    state: {[key: string]: {value: string, owners: Entity[]}} = {};
    ownerMapping: {[key: string]: [number, number][]} = {};
    columns: Ref<number>;
    rows: Ref<number>;

    constructor(columns: Ref<number>, rows: Ref<number>) {
        this.columns = columns;
        this.rows = rows;
        watch([columns, rows], () => {
            this.state = {};
            this.ownerMapping = {};
        });
        enableCommandLogging(this);
    }

    setAt = command((x: number, y: number, value: string, owner: Entity) => {
        if (!this.state[`${x}:${y}`]) {
            this.state[`${x}:${y}`] = {value, owners: [owner]}
        } else if (this.state[`${x}:${y}`].value != value) {
            throw Error(`Tried overwrite display state with conflicting value at ${x}:${y} (${this.state[`${x}:${y}`].value}->${value})`)
        } else {
            this.state[`${x}:${y}`].owners.push(owner)
        }

        if(!this.ownerMapping[owner.uid]) this.ownerMapping[owner.uid] = []
        this.ownerMapping[owner.uid].push([x, y])
    })

    removeAt = command((x: number, y: number, owner: Entity) => {
        let ownerIndex;
        if(!this.state[`${x}:${y}`] || (ownerIndex = this.state[`${x}:${y}`].owners.map(o => o.uid).indexOf(owner.uid)) === -1) throw Error(`Tried removing owner from non-owned position at ${x}:${y}`)
        if(this.state[`${x}:${y}`].owners.length == 1) {delete this.state[`${x}:${y}`]; return}
        this.state[`${x}:${y}`].owners.splice(ownerIndex, 1)
    })

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

    getOwnersAt(x: number, y: number): Entity[] {
        return this.state.state[`${x}:${y}`]?.owners || [];
    }

    getOwnedBy(owner: Entity): [number, number][] {
        return this.state.ownerMapping[owner.uid]
    }

    get columns() { return this.state.columns.value; }
    get rows() { return this.state.rows.value; }
}