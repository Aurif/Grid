import { v4 as uuidv4 } from 'uuid';
import { type Ref } from 'vue';

export default class TriggerManager {
    private triggerList: Ref<{x: number, y: number, id: string}[]>
    constructor(triggerList: {x: number, y: number, id: string}[]) {
        this.triggerList = triggerList
    }

    public addTrigger(x: number, y: number, targets: HTMLSpanElement[]) {
        const triggerId = 'trigger-'+uuidv4()
        this.triggerList.value.push({x, y, id: triggerId})
        
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `#${triggerId}:hover ~ .triggered-by-${triggerId} {opacity: 1; text-shadow: 0 0 4px white;}`

        targets[0].appendChild(style)
        targets.forEach(span => span.classList.add(`triggered-by-${triggerId}`));
    }
}