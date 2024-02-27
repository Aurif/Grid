import { v4 as uuidv4 } from 'uuid';

export default abstract class Input {
    uid: string = uuidv4()
    listeners: ((target: HTMLElement) => void)[] = []
    addListener(func: (target: HTMLElement) => void) {
        this.listeners.push(func)
    }

    onTrigger(target: HTMLElement) {
        for(const listener of this.listeners) {
            listener(target)
        }
    }
}