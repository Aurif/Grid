import { v4 as uuidv4 } from 'uuid';

export default abstract class Input {
    uid: string = uuidv4()
    listeners: ((target: HTMLElement, input: Input) => void)[] = []
    addListener(func: (target: HTMLElement, input: Input) => void) {
        this.listeners.push(func)
    }

    onTrigger(target: HTMLElement) {
        for(let listener of this.listeners) {
            listener(target, this)
        }
    }
}