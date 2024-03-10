import { command, enableCommandLogging } from '@/common/core/command'
import type { ContextCall } from '@/common/core/context'
import RendererProxy from '@/common/core/renderer-proxy'
import type HeaderRenderer from './HeaderRenderer.vue'

export default class HeaderRendererProxy extends RendererProxy<typeof HeaderRenderer> {
  constructor(...args: ConstructorParameters<typeof RendererProxy<typeof HeaderRenderer>>) {
    super(...args)
    enableCommandLogging(this)
  }

  setContent = command((_call: ContextCall, { content }: { content: string }) => {
    this.safeValue.content().value = content
  })

  get content(): string | undefined {
    if (!this.source.value) return
    return this.source.value.content().value
  }
}
