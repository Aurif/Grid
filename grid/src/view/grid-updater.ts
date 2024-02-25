import { command, enableCommandLogging } from '@/common/command';
import type GridRendererProxy from './grid-renderer-proxy';
import type { ContextCall } from '@/common/context';

export default class GridUpdater {
    proxy: GridRendererProxy;
    constructor(proxy: GridRendererProxy) {
        this.proxy = proxy
        enableCommandLogging(this);
    }

    setChar = command((_call: ContextCall, x: number, y: number, char: string) => {
        if (char.length !== 1) throw new Error('char must be a single character');
        const span = this.proxy.posToChar(x, y);
        span.innerText = char;
    })

    enablePos = command((_call: ContextCall, x: number, y: number) => {
        const span = this.proxy.posToChar(x, y);
        span.classList.add('active');
    })
    
    disablePos = command((_call: ContextCall, x: number, y: number) => {
        const span = this.proxy.posToChar(x, y);
        span.classList.remove('active');
    })
}