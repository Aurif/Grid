import { command } from '@/common/command';

export default class GridUpdater {
    mappingFunction: (x: number, y: number) => HTMLSpanElement = (x, y) => {throw new Error('GridUpdater not bound')};
    bind(mappingFunction: (x: number, y: number) => HTMLSpanElement) {
        this.mappingFunction = mappingFunction;
    }
    @command
    setChar(x: number, y: number, char: string) {
        if (char.length !== 1) throw new Error('char must be a single character');
        const span = this.mappingFunction(x, y);
        span.innerText = char;
    }
}