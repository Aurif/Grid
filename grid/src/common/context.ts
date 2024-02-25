import type { Command } from "./command"

class Context {
    val: string
    constructor(val: string) {
        this.val = val
    }

    call<A extends any[]>(command: Command<A>, ...args: A) {
        console.debug("In context:", this.val)
        // @ts-ignore
        command.call(this.call.bind(this) as ContextCall, ...args)
    }
}

export type ContextCall = Context['call'] & {__comes_from_context: boolean}
export function makeContext(...args: ConstructorParameters<typeof Context>): ContextCall {
    let context = new Context(...args)
    return context.call.bind(context) as ContextCall
}
export function blankContext(): ContextCall {
    return makeContext('')
}