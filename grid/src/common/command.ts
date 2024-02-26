import type { ContextCall } from "./context"

export function command<A extends any[]>(func: (call: ContextCall, ...args: A)=>void): Command<A> {
    return new Command([func])
}

export type CommandLike<A extends any[]> = Command<A> | ((call: ContextCall, ...args: A)=>void)

export class Command<A extends any[]>  {
    private name?: string
    private actions: ((call: ContextCall, ...args: A)=>void)[]
    constructor(actions: ((call: ContextCall, ...args: A)=>void)[]) {
        this.actions = actions
    }

    public setName(name: string) {
        if (this.name) throw Error(`Tried assigning name to a command which already had a name (old: ${this.name}, new: ${name})`)
        this.name = name
    }

    private call(call: ContextCall, ...args: A) {
        if (this.name) console.debug(`Running ${this.name} with`, ...args)
        for(const action of this.actions) {
            action(call, ...args)
        }
    }


    public addPostCall<F extends ((call: ContextCall, ...args: A)=>void)>(func: F) {
        this.actions.push(func)
    }


    static combine<A extends any[]>(...commands: CommandLike<A>[]): Command<A> {
        const funcs: ((call: ContextCall, ...args: A)=>void)[] = []
        for(const command of commands) {
            if (command instanceof Command) funcs.push((call: ContextCall, ...args: A)=>call(command as Command<A>, ...args))
            else funcs.push(command)
        }
        return new Command(funcs)
    }
}

export function enableCommandLogging(target: any) {
    for(const key in target) {
        if (target[key] instanceof Command) target[key].name = `${target.constructor.name}.${key}`
    }
}