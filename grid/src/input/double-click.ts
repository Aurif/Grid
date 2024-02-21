import { onMounted, onUnmounted } from 'vue'
import Input from './input'

export default class DoubleClickInput extends Input {
    constructor() {
        super()
        let onDblClick = (event: MouseEvent) => this.onTrigger(event.target as HTMLElement)
        onMounted(() => window.addEventListener('dblclick', onDblClick))
        onUnmounted(() => window.removeEventListener('dblclick', onDblClick))
    }
}