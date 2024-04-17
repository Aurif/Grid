import { command, enableCommandLogging } from '@/common/core/commands/command'
import type { ContextCall } from '@/common/core/commands/context'
import type Entity from '@/common/core/commands/entity'
import type { Ref } from 'vue'
import { watch } from 'vue'

export default class StateDisplay {
  state: { [key: string]: { char: string; owners: Entity[] } } = {}
  ownerMapping: { [key: string]: [number, number][] } = {}
  rows: Ref<number>
  columns: Ref<number>
  setAt = command(
    (
      _call: ContextCall,
      { x, y, char, owner }: { x: number; y: number; char: string; owner: Entity }
    ) => {
      if (!this.state[`${x}:${y}`]) {
        this.state[`${x}:${y}`] = { char, owners: [owner] }
      } else if (
        this.state[`${x}:${y}`].char != char &&
        !(
          this.state[`${x}:${y}`].owners.length == 1 &&
          this.state[`${x}:${y}`].owners[0].uid == owner.uid
        )
      ) {
        throw Error(
          `Tried to overwrite display state with conflicting char at ${x}:${y} (${this.state[`${x}:${y}`].char}->${char})`
        )
      } else {
        let ownerIndex
        if (
          (ownerIndex = this.state[`${x}:${y}`].owners.map((o) => o.uid).indexOf(owner.uid)) === -1
        )
          this.state[`${x}:${y}`].owners.push(owner)
        this.state[`${x}:${y}`].owners[ownerIndex] = owner
      }

      if (!this.ownerMapping[owner.uid]) this.ownerMapping[owner.uid] = []
      if (this.ownerMapping[owner.uid].map(([ix, iy]) => `${ix}:${iy}`).indexOf(`${x}:${y}`) === -1)
        this.ownerMapping[owner.uid].push([x, y])
    }
  )
  removeAt = command(
    (_call: ContextCall, { x, y, owner }: { x: number; y: number; owner: Entity }) => {
      let ownerIndex
      if (
        !this.state[`${x}:${y}`] ||
        (ownerIndex = this.state[`${x}:${y}`].owners.map((o) => o.uid).indexOf(owner.uid)) === -1
      )
        throw Error(`Tried removing owner from non-owned position at ${x}:${y}`)
      if (this.state[`${x}:${y}`].owners.length == 1) {
        delete this.state[`${x}:${y}`]
      } else {
        this.state[`${x}:${y}`].owners.splice(ownerIndex, 1)
      }

      let ownerMappingIndex
      if (
        !this.ownerMapping[owner.uid] ||
        (ownerMappingIndex = this.ownerMapping[owner.uid]
          .map(([ix, iy]) => `${ix}:${iy}`)
          .indexOf(`${x}:${y}`)) === -1
      )
        throw Error(
          `Couldn't remove position ${x}:${y} from owner mapping, state is considered corrupted`
        )
      if (this.ownerMapping[owner.uid].length == 1) {
        delete this.ownerMapping[owner.uid]
      } else {
        this.ownerMapping[owner.uid].splice(ownerMappingIndex, 1)
      }
    }
  )

  constructor(rows: Ref<number>, columns: Ref<number>) {
    this.rows = rows
    this.columns = columns
    watch([columns, rows], () => {
      this.state = {}
      this.ownerMapping = {}
    })
    enableCommandLogging(this)
  }

  get reader(): StateDisplayReader {
    return new StateDisplayReader(this)
  }
}

export class StateDisplayReader {
  private state: StateDisplay

  constructor(state: StateDisplay) {
    this.state = state
  }

  get columns() {
    return this.state.columns.value
  }

  get rows() {
    return this.state.rows.value
  }

  getAt(x: number, y: number): string | undefined {
    return this.state.state[`${x}:${y}`]?.char
  }

  getOwnersAt(x: number, y: number): Entity[] {
    return [...(this.state.state[`${x}:${y}`]?.owners || [])]
  }

  getOwnedBy(owner: Entity): { x: number; y: number }[] {
    return [...(this.state.ownerMapping[owner.uid].map(([x, y]) => ({ x, y })) || [])]
  }

  watchResize(handler: () => void) {
    return watch([this.state.columns, this.state.rows], handler, { flush: 'post' })
  }
}
