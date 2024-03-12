import { mapValues } from 'lodash'
import type { Ref } from 'vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'

export default class LineRendering {
  public linePositions: Ref<{ [id: string]: { x1: number; y1: number; x2: number; y2: number } }> =
    ref({})
  private readonly svgRef: Ref<HTMLElement | undefined>
  private readonly nodesRef: Ref<{ [id: string]: SVGElement }>
  private readonly nodePositions: Ref<{
    [id: string]: { degree: number; layer: number; parent?: string }
  }>
  private readonly minDistance: number

  constructor(
    svgRef: Ref<HTMLElement | undefined>,
    nodesRef: Ref<{ [p: string]: SVGElement }>,
    nodePositions: Ref<{ [p: string]: { degree: number; layer: number; parent?: string } }>,
    minDistance: number
  ) {
    this.svgRef = svgRef
    this.nodesRef = nodesRef
    this.nodePositions = nodePositions
    this.minDistance = minDistance
    this.mount()
  }

  private nodePos(nodeId: string): { x: number; y: number } {
    const node = this.nodesRef.value[nodeId]
    if (!node) return { x: 0, y: 50 }
    if (!this.svgRef.value)
      throw Error('SVG is not mounted when drawing line, component is considered corrupted')
    const svgRect = this.svgRef.value.getBoundingClientRect()
    const nodeRect = node.getBoundingClientRect()
    const elX = nodeRect.left - svgRect.left + nodeRect.width / 2
    const elY = nodeRect.top - svgRect.top + nodeRect.height / 2
    return { x: elX, y: elY }
  }

  private mount() {
    const lineRedrawTrigger = ref(0)
    this.linePositions = computed(() => {
      lineRedrawTrigger.value
      return mapValues(this.nodePositions.value, ({ parent }, key) => {
        const thisPos = this.nodePos(key)
        let parentPos
        if (parent == undefined) {
          if (!this.svgRef.value)
            throw Error('SVG is not mounted when drawing line, component is considered corrupted')
          const svgRect = this.svgRef.value.getBoundingClientRect()
          parentPos = { x: svgRect.width / 2, y: svgRect.height / 2 }
        } else {
          parentPos = this.nodePos(parent)
        }

        const dist = Math.sqrt(
          Math.pow(thisPos.x - parentPos.x, 2) + Math.pow(thisPos.y - parentPos.y, 2)
        )
        const diffX = parentPos.x - thisPos.x
        const diffY = parentPos.y - thisPos.y

        const nudgeThis = 20 / dist
        const nudgeParent = (parent == undefined ? this.minDistance : 20) / dist
        if (nudgeThis + nudgeParent >= 1)
          return { x1: thisPos.x, y1: thisPos.y, x2: thisPos.x, y2: thisPos.y }

        thisPos.x += diffX * nudgeThis
        thisPos.y += diffY * nudgeThis
        parentPos.x -= diffX * nudgeParent
        parentPos.y -= diffY * nudgeParent

        return { x1: parentPos.x, y1: parentPos.y, x2: thisPos.x, y2: thisPos.y }
      })
    })

    function triggerLineRedraw() {
      lineRedrawTrigger.value += 1
    }

    onMounted(() => window.addEventListener('resize', triggerLineRedraw))
    onUnmounted(() => window.removeEventListener('resize', triggerLineRedraw))
  }
}
