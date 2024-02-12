import { command } from '@/common/command';

export default class ScatterModel {
    renderCommand: (x: number, y: number, char: string) => void;
    constructor(renderCommand: (x: number, y: number, char: string) => void) {
        this.renderCommand = renderCommand;
    }
    @command
    onNewEntry(entry: string) {
        for(let [i, char] of entry.split('').entries()) this.renderCommand(i, 0, char);
        
    }
}