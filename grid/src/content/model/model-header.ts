import { command, enableCommandLogging, type Command } from '@/common/core/commands/command'
import { blankContext, type ContextCall } from '@/common/core/commands/context'
import type { StateDisplayReader } from './state-display'

export default class ModelHeader {
  private readonly renderCommand: Command<{ x: number; y: number; char: string }>
  private readonly state: StateDisplayReader
  private content: string = ''
  setContent = command((call: ContextCall, { content }: { content: string }) => {
    this.content = content
    const startX = Math.floor((this.state.columns - content.length) / 2)
    for (const [i, char] of content.split('').entries())
      call(this.renderCommand, { x: startX + i, y: 0, char })
  })

  constructor(
    renderCommand: Command<{ x: number; y: number; char: string }>,
    state: StateDisplayReader
  ) {
    this.renderCommand = renderCommand
    this.state = state
    state.watchResize(() => {
      const call = blankContext()
      call(this.setContent, { content: this.content })
    })
    enableCommandLogging(this)
  }
}
