import { command, enableCommandLogging, type Command } from '@/common/core/command'
import { ContextClass, type ContextCall } from '@/common/core/context'
import seededRandom from '@/common/utils/seeded-random'
import type { Entry } from '@/common/utils/types'
import { sum } from 'lodash'

export default class ModelBranchesCone<CC extends { parent: string }> {
  private readonly minDegree: number
  private readonly maxDegree: number
  private readonly root: string
  private readonly renderCommand: Command<{
    id: string
    degree: number
    layer: number
    parent?: string
  }>
  private readonly contextClass: ContextClass<Entry<CC>>
  render = command((call: ContextCall, { data }: { data: { [id: string]: CC } }) => {
    const tree = new Branch(this.root, new ParsedTreeStructure(data))
    const positions = tree.makePositions(this.minDegree, this.maxDegree, -1)
    for (const id in positions) {
      if (id == this.root) continue
      const node = positions[id]
      let parentId: string | undefined = data[id].parent
      if (parentId == this.root) parentId = undefined

      const newCall = this.contextClass.make(data[id])
      newCall(this.renderCommand, {
        id,
        degree: node.degree,
        layer: node.layer,
        parent: parentId
      })
    }
  })

  constructor(
    minDegree: number,
    maxDegree: number,
    root: string,
    renderCommand: Command<{ id: string; degree: number; layer: number }>,
    contextClass: ContextClass<Entry<CC>>
  ) {
    this.minDegree = minDegree
    this.maxDegree = maxDegree
    this.root = root
    this.renderCommand = renderCommand
    this.contextClass = contextClass
    enableCommandLogging(this)
  }
}

class ParsedTreeStructure {
  private rawNodes: { [id: string]: { parent: string } }
  private childrenMapping: { [id: string]: string[] } = {}

  constructor(rawNodes: { [id: string]: { parent: string } }) {
    this.rawNodes = rawNodes
    this.buildChildrenMapping()
  }

  public getChildren(nodeId: string): string[] {
    return this.childrenMapping[nodeId] || []
  }

  private buildChildrenMapping() {
    for (const nodeId in this.rawNodes) {
      const parentId = this.rawNodes[nodeId].parent
      if (!this.childrenMapping[parentId]) this.childrenMapping[parentId] = []
      this.childrenMapping[parentId].push(nodeId)
    }
  }
}

class Branch {
  private rootId: string
  private subbranches: Branch[]
  private cachedPriority?: number
  private cachedDepth?: number

  constructor(rootId: string, treeStructure: ParsedTreeStructure) {
    this.rootId = rootId
    this.subbranches = treeStructure.getChildren(rootId).map((id) => new Branch(id, treeStructure))
  }

  public calculatePriority(): number {
    if (!this.cachedPriority)
      this.cachedPriority = Math.max(
        1,
        sum(this.subbranches.map((x) => x.calculatePriority())) / 1.6
      )
    return this.cachedPriority
  }

  public makePositions(
    minDegree: number,
    maxDegree: number,
    layer: number
  ): { [id: string]: { degree: number; layer: number } } {
    let positions = {
      [this.rootId]: { degree: (minDegree + maxDegree) / 2, layer }
    }
    if (this.subbranches.length == 0) return positions

    const sliceWidth =
      (maxDegree - minDegree) / sum(this.subbranches.map((x) => x.calculatePriority()))
    let sliceUsed = 0
    for (const subbranch of this.subbranches) {
      const thisSlice = subbranch.calculatePriority()
      const maxLayerIncrease = Math.min(1.15, (3 - layer) / subbranch.calculateDepth())
      const rand = seededRandom(subbranch.rootId)
      positions = {
        ...positions,
        ...subbranch.makePositions(
          minDegree + sliceWidth * sliceUsed,
          minDegree + sliceWidth * (sliceUsed + thisSlice),
          layer < 0 ? rand() * 0.3 : layer + maxLayerIncrease * (0.2 + rand() * 0.8)
        )
      }
      sliceUsed += thisSlice
    }
    return positions
  }

  public calculateDepth(): number {
    if (!this.cachedDepth)
      this.cachedDepth = Math.max(0, ...this.subbranches.map((x) => x.calculateDepth())) + 1
    return this.cachedDepth
  }
}
