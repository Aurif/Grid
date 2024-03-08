import singleton from '@/common/utils/singleton'
import Input from '@/content/input/input'
import { onMounted, onUnmounted } from 'vue'

class InputClickRight extends Input {
  constructor() {
    super()
    const onClick = (event: MouseEvent) =>
      this.onTrigger(event.target as HTMLElement, () => {
        event.preventDefault()
      })
    onMounted(() => window.addEventListener('contextmenu', onClick))
    onUnmounted(() => window.removeEventListener('contextmenu', onClick))
  }
}
export default singleton(InputClickRight)
