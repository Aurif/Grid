import type { Command } from "./command"

type Modifier<A extends any[]> = (command: Command<A>)=>Command<A>
export class ContextClass<C> {
    private modifiers: {[key: string]: [Modifier<any>, (value: C)=>boolean][]} = {}
    registerModifier<A extends any[]>(command: Command<A>, condition: (value: C)=>boolean, modifier: Modifier<A>) {
        if (!this.modifiers[command.uid]) this.modifiers[command.uid] = []
        this.modifiers[command.uid].push([modifier, condition])
    }
    private getActiveModifiers(value: C): {[key: string]: Modifier<any>[]} {
        const result: {[key: string]: Modifier<any>[]} = {}
        for(const key in this.modifiers) {
            for(const val of this.modifiers[key]) {
                if (!val[1](value)) continue
                if (!result[key]) result[key] = []
                result[key].push(val[0])
            }
        }
        return result
    }

    make(value: C): ContextCall {
        const context =  new Context(this, value)
        return context.call.bind(context) as ContextCall
    }
}

class Context<C> {
    private value: C
    private activeModifiers: {[key: string]: Modifier<any>[]}
    constructor(parent: ContextClass<C>, value: C) {
        this.activeModifiers = parent['getActiveModifiers'](value)
        this.value = value
    }

    private getModified<A extends any[]>(command: Command<A>): Command<A> {
        const commandUid = command.uid
        let currentCommand = command
        for (const modifier of (this.activeModifiers[commandUid] || [])) {
            currentCommand = modifier(currentCommand)
            if (currentCommand.uid != commandUid) throw Error("A command modifier cannot change the command's type")
        }
        return currentCommand
    }

    call<A extends any[]>(command: Command<A>, ...args: A) {
        this.getModified(command)['call'](this.call.bind(this) as ContextCall, ...args)
    }
}

export type ContextCall = Context<any>['call'] & {__comes_from_context: boolean}
export function blankContext(): ContextCall {
    return new ContextClass().make(null)
}

export function callOnInit<A extends any[]>(command: Command<A>, ...args: A) {
    setTimeout(() => {
        blankContext()(command, ...args)
    }, 1)
}