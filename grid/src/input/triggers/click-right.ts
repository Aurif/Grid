import { onMounted, onUnmounted } from 'vue'
import Input from '@/input/input'
import singleton from '@/common/singleton'


class InputClickRight extends Input {
    constructor() {
        super()
        const onClick = (event: MouseEvent) => this.onTrigger(event.target as HTMLElement, ()=>{event.preventDefault()})
        onMounted(() => window.addEventListener('contextmenu', onClick))
        onUnmounted(() => window.removeEventListener('contextmenu', onClick))
    }
}
export default singleton(InputClickRight)