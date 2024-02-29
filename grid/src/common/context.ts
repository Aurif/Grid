import type { Command, CommandArguments } from "./command"

type Modifier<A extends CommandArguments> = (command: Command<A>)=>Command<A>
export class ContextClass<C> {
    private modifiers: {[key: string]: Modifier<any>[]} = {}
    registerModifier<A extends CommandArguments>(command: Command<A>, modifier: Modifier<A>) {
        if (!this.modifiers[command.uid]) this.modifiers[command.uid] = []
        this.modifiers[command.uid].push(modifier)
    }
    

    private getModified<A extends CommandArguments>(command: Command<A>): Command<A> {
        const commandUid = command.uid
        let currentCommand = command
        for (const modifier of (this.modifiers[commandUid] || [])) {
            currentCommand = modifier(currentCommand)
            if (currentCommand.uid != commandUid) throw Error("A command modifier cannot change the command's type")
        }
        return currentCommand
    }

    make(value: C): ContextCall {
        const context =  new Context(this, value)
        return context.call.bind(context) as ContextCall
    }
}

class Context<C> {
    private value: C
    private parent: ContextClass<C>
    private commandCache: {[commandUid: string]: Command<any>} = {}
    constructor(parent: ContextClass<C>, value: C) {
        this.parent = parent
        this.value = value
    }

    private getModified<A extends CommandArguments>(command: Command<A>): Command<A> {
        if (!this.commandCache[command.uid]) this.commandCache[command.uid] = this.parent["getModified"](command)
        return this.commandCache[command.uid]
    }

    public call<A extends CommandArguments>(command: Command<A>, args: A): void {
        this.getModified(command)['callDirect'](this.call.bind(this) as ContextCall, args || {})
    }
}

export type ContextCall = Context<any>['call'] & {__comes_from_context: boolean}
export function blankContext(): ContextCall {
    return new ContextClass().make(null)
}

export function callOnInit<A extends CommandArguments>(command: Command<A>, args: A) {
    setTimeout(() => {
        blankContext()(command, args)
    }, 1)
}