import { command, enableCommandLogging, type Command } from '@/common/core/command'
import { type ContextCall } from '@/common/core/context'
import { sum } from 'lodash'

export default class ModelBranchesCone {
  private readonly minDegree: number
  private readonly maxDegree: number
  private readonly root: string
  private readonly renderCommand: Command<{ id: string; degree: number; layer: number }>

  constructor(
    minDegree: number,
    maxDegree: number,
    root: string,
    renderCommand: Command<{ id: string; degree: number; layer: number }>
  ) {
    this.minDegree = minDegree
    this.maxDegree = maxDegree
    this.root = root
    this.renderCommand = renderCommand
    enableCommandLogging(this)
  }

  render = command(
    (call: ContextCall, { data }: { data: { [id: string]: { parent: string } } }) => {
      const tree = new Branch(this.root, new ParsedTreeStructure(data))
      const positions = tree.makePositions(this.minDegree, this.maxDegree, -1)
      for (const id in positions) {
        if (id == this.root) continue
        const node = positions[id]
        call(this.renderCommand, { id, degree: node.degree, layer: node.layer })
      }
    }
  )
}

class ParsedTreeStructure {
  private rawNodes: { [id: string]: { parent: string } }
  private childrenMapping: { [id: string]: string[] } = {}
  constructor(rawNodes: { [id: string]: { parent: string } }) {
    this.rawNodes = rawNodes
    this.buildChildrenMapping()
  }

  private buildChildrenMapping() {
    for (const nodeId in this.rawNodes) {
      const parentId = this.rawNodes[nodeId].parent
      if (!this.childrenMapping[parentId]) this.childrenMapping[parentId] = []
      this.childrenMapping[parentId].push(nodeId)
    }
  }

  public getChildren(nodeId: string): string[] {
    return this.childrenMapping[nodeId] || []
  }
}

class Branch {
  private rootId: string
  private subbranches: Branch[]
  constructor(rootId: string, treeStructure: ParsedTreeStructure) {
    this.rootId = rootId
    this.subbranches = treeStructure.getChildren(rootId).map((id) => new Branch(id, treeStructure))
  }

  private cachedPriority?: number
  public calculatePriority(): number {
    if (!this.cachedPriority)
      this.cachedPriority = Math.max(1, sum(this.subbranches.map((x) => x.calculatePriority())) / 2)
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
      positions = {
        ...positions,
        ...subbranch.makePositions(
          minDegree + sliceWidth * sliceUsed,
          minDegree + sliceWidth * (sliceUsed + thisSlice),
          layer + 1
        )
      }
      sliceUsed += thisSlice
    }
    return positions
  }
}
