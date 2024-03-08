import singleton from '@/common/utils/singleton'
import Input from '@/content/input/input'
import { onMounted, onUnmounted } from 'vue'

class InputClickDouble extends Input {
  constructor() {
    super()
    const onDblClick = (event: MouseEvent) => this.onTrigger(event.target as HTMLElement)
    onMounted(() => window.addEventListener('dblclick', onDblClick))
    onUnmounted(() => window.removeEventListener('dblclick', onDblClick))
  }
}
export default singleton(InputClickDouble)
