import { command } from '@/common/command';
import type GridRendererProxy from './grid-renderer-proxy';

export default class GridUpdater {
    proxy: GridRendererProxy;
    constructor(proxy: GridRendererProxy) {
        this.proxy = proxy
    }

    @command
    setChar(x: number, y: number, char: string) {
        if (char.length !== 1) throw new Error('char must be a single character');
        const span = this.proxy.posToChar(x, y);
        span.innerText = char;
    }

    @command
    enablePos(x: number, y: number) {
        const span = this.proxy.posToChar(x, y);
        span.classList.add('active');
    }
    
    @command
    disablePos(x: number, y: number) {
        const span = this.proxy.posToChar(x, y);
        span.classList.remove('active');
    }
}