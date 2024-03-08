import singleton from '@/common/utils/singleton'
import Input from '@/content/input/input'
import { onMounted, onUnmounted } from 'vue'

class InputClick extends Input {
  constructor() {
    super()
    const onClick = (event: MouseEvent) => this.onTrigger(event.target as HTMLElement)
    onMounted(() => window.addEventListener('click', onClick))
    onUnmounted(() => window.removeEventListener('click', onClick))
  }
}
export default singleton(InputClick)
