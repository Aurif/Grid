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

    setColor = command((_call: ContextCall, x: number, y: number, color?: string) => {
        const span = this.proxy.posToChar(x, y);
        if(!color) span.style.removeProperty('--color-active');
        else span.style.setProperty('--color-active', color);
    })

    enablePos = command((_call: ContextCall, x: number, y: number) => {
        const span = this.proxy.posToChar(x, y);
        span.classList.add('active');
    })
    
    disablePos = command((_call: ContextCall, x: number, y: number) => {
        const span = this.proxy.posToChar(x, y);
        span.classList.remove('active');
        span.style.removeProperty('--color-active');
    })
}