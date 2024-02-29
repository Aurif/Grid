import { onMounted, onUnmounted } from 'vue'
import Input from '@/input/input'
import singleton from '@/common/singleton'


class InputScrollDown extends Input {
    constructor() {
        super()
        const onScroll = (event: WheelEvent) => {if (event.deltaY > 0) this.onTrigger(event.target as HTMLElement)}
        onMounted(() => window.addEventListener('wheel', onScroll))
        onUnmounted(() => window.removeEventListener('wheel', onScroll))
    }
}
export default singleton(InputScrollDown)