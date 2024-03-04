import { Command, command, enableCommandLogging } from '@/common/command'
import { blankContext, type ContextCall } from '@/common/context'
import type { StateDisplayReader } from './state-display'

export default class ModelCorner {
  private renderCommand: Command<{ x: number; y: number; char: string }>
  private state: StateDisplayReader
  private entries: string[] = []

  constructor(
    renderCommand: Command<{ x: number; y: number; char: string }>,
    state: StateDisplayReader
  ) {
    this.renderCommand = renderCommand
    this.state = state
    enableCommandLogging(this)
  }

  displayEntry = command((call: ContextCall, { entry }: { entry: string }) => {
    this.entries.push(entry)
    this.entries.sort((a, b) => b.length - a.length)
    call(this.rerender, {})
  })

  rerender = command(() => {
    const newCall = blankContext()
    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i]
      for (let j = 0; j < entry.length; j++) {
        newCall(this.renderCommand, { x: j, y: this.state.rows - 1 - i, char: entry[j] })
      }
    }
  })
}
