import { onMounted, onUnmounted } from 'vue'
import Input from './input'
import singleton from '@/common/singleton'


class ClickInput extends Input {
    constructor() {
        super()
        const onClick = (event: MouseEvent) => this.onTrigger(event.target as HTMLElement)
        onMounted(() => window.addEventListener('click', onClick))
        onUnmounted(() => window.removeEventListener('click', onClick))
    }
}
export default singleton(ClickInput)