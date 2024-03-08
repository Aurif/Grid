import { v4 as uuidv4 } from 'uuid';

export default abstract class Input {
    uid: string = uuidv4()
    listeners: ((target: HTMLElement) => boolean)[] = []
    addListener(func: (target: HTMLElement) => boolean) {
        this.listeners.push(func)
    }

    onTrigger(target: HTMLElement, onAction: ()=>void = ()=>{}) {
        let actionHappened = false
        for(const listener of this.listeners) {
            actionHappened ||= listener(target)
        }
        if (actionHappened) onAction()
    }
}