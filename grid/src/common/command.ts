export function command<A extends any[]>(func: (...args: A)=>void): Command<A> {
    return new Command([func])
}

export type CommandLike<A extends any[]> = Command<A> | ((...args: A)=>void)

export class Command<A extends any[]>  {
    private name?: string
    private actions: ((...args: A)=>void)[]
    constructor(actions: ((...args: A)=>void)[]) {
        this.actions = actions
    }

    public setName(name: string) {
        if (this.name) throw Error(`Tried assigning name to a command which already had a name (old: ${this.name}, new: ${name})`)
        this.name = name
    }

    public get call(): ((...args: A) => void) {
        return (...args: A) => {
            if (this.name) console.debug(`Running ${this.name} with`, ...args)
            for(let action of this.actions) {
                action(...args)
            }
        }
    }


    public addPostCall<F extends ((...args: A)=>void)>(func: F) {
        this.actions.push(func)
    }


    static combine<A extends any[]>(...commands: CommandLike<A>[]): Command<A> {
        let funcs: ((...args: A)=>void)[] = []
        for(let command of commands) {
            if (command instanceof Command) funcs.push(command.call)
            else funcs.push(command)
        }
        return new Command(funcs)
    }
}

export function enableCommandLogging(target: any) {
    for(let key in target) {
        if (target[key] instanceof Command) target[key].name = `${target.constructor.name}.${key}`
    }
}