import singleton from '@/common/utils/singleton'
import Input from '@/content/input/input'
import { onMounted, onUnmounted } from 'vue'

class InputScrollUp extends Input {
  constructor() {
    super()
    const onScroll = (event: WheelEvent) => {
      if (event.deltaY < 0) this.onTrigger(event.target as HTMLElement)
    }
    onMounted(() => window.addEventListener('wheel', onScroll))
    onUnmounted(() => window.removeEventListener('wheel', onScroll))
  }
}
export default singleton(InputScrollUp)
