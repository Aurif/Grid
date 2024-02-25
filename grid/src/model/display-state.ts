import { command, enableCommandLogging } from "@/common/command";
import type { ContextCall } from "@/common/context";
import type Entity from "@/common/entity";
import type { Ref } from "vue";
import { watch } from 'vue'

export default class DisplayState {
    state: {[key: string]: {value: string, owners: Entity[]}} = {};
    ownerMapping: {[key: string]: [number, number][]} = {};
    rows: Ref<number>;
    columns: Ref<number>;

    constructor(rows: Ref<number>, columns: Ref<number>) {
        this.rows = rows;
        this.columns = columns;
        watch([columns, rows], () => {
            this.state = {};
            this.ownerMapping = {};
        });
        enableCommandLogging(this);
    }

    setAt = command((_call: ContextCall, x: number, y: number, value: string, owner: Entity) => {
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

    removeAt = command((_call: ContextCall, x: number, y: number, owner: Entity) => {
        let ownerIndex;
        if(!this.state[`${x}:${y}`] || (ownerIndex = this.state[`${x}:${y}`].owners.map(o => o.uid).indexOf(owner.uid)) === -1) throw Error(`Tried removing owner from non-owned position at ${x}:${y}`)
        if(this.state[`${x}:${y}`].owners.length == 1) {delete this.state[`${x}:${y}`]}
        else {this.state[`${x}:${y}`].owners.splice(ownerIndex, 1)}

        let ownerMappingIndex;
        if(!this.ownerMapping[owner.uid] || (ownerMappingIndex = this.ownerMapping[owner.uid].map(([ix, iy])=>`${ix}:${iy}`).indexOf(`${x}:${y}`)) === -1) throw Error(`Couldn't remove position ${x}:${y} from owner mapping, state is considered corrupted`)
        if(this.ownerMapping[owner.uid].length == 1) {delete this.ownerMapping[owner.uid]}
        else {this.ownerMapping[owner.uid].splice(ownerMappingIndex, 1)}
    })

    get reader() {
        return new DisplayStateReader(this);
    }

}

export class DisplayStateReader {
    private state: DisplayState;

    constructor(state: DisplayState) {
        this.state = state;
    }

    getAt(x: number, y: number): string | undefined {
        return this.state.state[`${x}:${y}`]?.value;
    }

    getOwnersAt(x: number, y: number): Entity[] {
        return [...(this.state.state[`${x}:${y}`]?.owners || [])];
    }

    getOwnedBy(owner: Entity): [number, number][] {
        return [...(this.state.ownerMapping[owner.uid] || [])];
    }

    watchResize(handler: (()=>void)) {
        return watch([this.state.columns, this.state.rows], handler, { flush: 'post' })
    }

    get columns() { return this.state.columns.value; }
    get rows() { return this.state.rows.value; }
}