import GridRenderer from "./GridRenderer.vue"
import type { ComponentRef } from "@/common/types";

export default class GridRendererProxy {
    source: ComponentRef<typeof GridRenderer>;

    constructor(bind: ComponentRef<typeof GridRenderer>) {
        this.source = bind
    }

    posToChar(x: number, y: number): HTMLSpanElement { return this.source.value.posToChar(x, y) }
    spanToPos(span: HTMLElement): [number, number] | undefined { return this.source.value.spanToPos(span) }

}