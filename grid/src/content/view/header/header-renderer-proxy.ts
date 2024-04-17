import { command, enableCommandLogging } from '@/common/core/commands/command'
import type { ContextCall } from '@/common/core/commands/context'
import RendererProxy from '@/common/core/renderer-proxy'
import type HeaderRenderer from './HeaderRenderer.vue'

export default class HeaderRendererProxy extends RendererProxy<typeof HeaderRenderer> {
  setContent = command((_call: ContextCall, { content }: { content: string }) => {
    this.safeValue.content().value = content
  })

  constructor(...args: ConstructorParameters<typeof RendererProxy<typeof HeaderRenderer>>) {
    super(...args)
    enableCommandLogging(this)
  }

  get content(): string | undefined {
    if (!this.source.value) return
    return this.source.value.content().value
  }
}
