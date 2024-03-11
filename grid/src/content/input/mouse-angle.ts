import { blankContext } from '@/common/core/context'
import Listeners from '@/common/core/listeners'
import mousePosition from '@/content/input/mouse-position'
import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'

export default class MouseAngle {
  public readonly onSelected = new Listeners<{ segment: number }>()
  public readonly onUnselected = new Listeners<{ segment: number }>()
  private readonly centerElement: Ref<HTMLElement>
  private readonly segments: number

  constructor(centerElement: Ref<HTMLElement>, segments: number) {
    this.centerElement = centerElement
    this.segments = segments
    this.startTracking()
  }

  private _currentSegment: Ref<number | undefined> = ref(undefined)

  public get currentSegment(): number | undefined {
    return this._currentSegment.value
  }

  private startTracking() {
    const { x, y } = mousePosition()
    this._currentSegment = computed(() => {
      if (!this.centerElement.value) return
      const rect = this.centerElement.value.getBoundingClientRect()
      const elX = rect.left + rect.width / 2
      const elY = rect.top + rect.height / 2

      const angle = Math.atan2(elX - x.value, -elY + y.value) + Math.PI
      return Math.round((angle / Math.PI / 2) * this.segments) % this.segments
    })

    watch(this._currentSegment, (newVal, oldVal) => {
      if (newVal != undefined) this.onSelected.emit(blankContext(), { segment: newVal })
      if (oldVal != undefined) this.onUnselected.emit(blankContext(), { segment: oldVal })
    })
  }
}
