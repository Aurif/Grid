import RendererProxy from '@/common/core/renderer-proxy'
import type MenuCircularRenderer from '@/content/view/menu-circular/MenuCircularRenderer.vue'

export default class MenuCircularRendererProxy extends RendererProxy<typeof MenuCircularRenderer> {
  segmentToArc(i: number): SVGPathElement {
    return this.safeValue.segmentToArc(i)
  }
}
