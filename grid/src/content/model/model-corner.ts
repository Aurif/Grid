import { Command, command, enableCommandLogging } from '@/common/core/command'
import { blankContext, type ContextCall } from '@/common/core/context'
import type { StateDisplayReader } from './state-display'

export default class ModelCorner {
  private readonly renderCommand: Command<{ x: number; y: number; char: string }>
  private readonly state: StateDisplayReader
  private entries: string[] = []
  rerender = command(() => {
    const newCall = blankContext()
    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i]
      Array.from(entry).forEach((char, j) => {
        newCall(this.renderCommand, { x: j, y: this.state.rows - 1 - i, char })
      })
    }
  })
  setDisplayedEntries = command((call: ContextCall, { entries }: { entries: string[] }) => {
    this.entries = [...entries]
    this.entries.sort((a, b) => b.length - a.length)
    call(this.rerender, {})
  })

  displayEntry = command((call: ContextCall, { entry }: { entry: string }) => {
    this.entries.push(entry)
    this.entries.sort((a, b) => b.length - a.length)
    call(this.rerender, {})
  })

  constructor(
    renderCommand: Command<{ x: number; y: number; char: string }>,
    state: StateDisplayReader
  ) {
    this.renderCommand = renderCommand
    this.state = state
    enableCommandLogging(this)
  }
}
