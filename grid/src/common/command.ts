export let command = <A extends any[]>(func: (...args: A)=>void): Command<A> => {
    return new Command([func.bind(this)])
}

export type CommandLike<A extends any[]> = Command<A> | ((...args: A)=>void)

export class Command<A extends any[]>  {
    private actions: ((...args: A)=>void)[]
    constructor(actions: ((...args: A)=>void)[]) {
        this.actions = actions
    }

    public get call(): ((...args: A) => void) {
        return (...args: A) => {
            for(let action of this.actions) action(...args)
        }
    }

    public addPostCall<F extends ((...args: A)=>void)>(func: F) {
        this.actions.push(func)
    }

    static combine<A extends any[]>(...commands: CommandLike<A>[]): Command<A> {
        let funcs: ((...args: A)=>void)[] = []
        for(let command of commands) {
            if (command instanceof Command) funcs = funcs.concat(command.actions)
            else funcs.push(command)
        }
        return new Command(funcs)
    }
}