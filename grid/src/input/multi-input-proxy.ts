import type Entity from "@/common/entity";
import type Input from "./input";
import type { InputAcceptorSpawn } from "./input-acceptor";
import InputAcceptor from "./input-acceptor";

export default class MultiInputProxy {
    readonly acceptor: InputAcceptor = new InputAcceptor()
    private mapping: (element: HTMLElement) => InputAcceptorSpawn | undefined
    private inputUidCache: Set<string> = new Set()
    
    constructor(mapping: (element: HTMLElement) => InputAcceptorSpawn | undefined) {
        this.mapping = mapping
    }

    on(input: Input, action: (target: Entity) => void): this {
        if(!this.inputUidCache.has(input.uid)) {
            input.addListener(el => this.mapping(el)?.trigger(input))
            this.inputUidCache.add(input.uid)
        } else {
            throw Error("Same input has been registered twice in the same multi-input proxy")
        }
        this.acceptor.on(input, action)
        return this
    }
}