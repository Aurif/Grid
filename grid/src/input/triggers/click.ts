import { onMounted, onUnmounted } from 'vue'
import Input from '@/input/input'
import singleton from '@/common/singleton'


class InputClick extends Input {
    constructor() {
        super()
        const onClick = (event: MouseEvent) => this.onTrigger(event.target as HTMLElement)
        onMounted(() => window.addEventListener('click', onClick))
        onUnmounted(() => window.removeEventListener('click', onClick))
    }
}
export default singleton(InputClick)