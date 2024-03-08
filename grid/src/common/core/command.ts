import { v4 as uuidv4 } from 'uuid'
import type { ContextCall } from './context'

export function command<A extends CommandArguments>(
  func: (call: ContextCall, args: A) => void
): Command<A> {
  return new Command([func])
}

export type CommandArguments = object & { length?: never }
export type CommandLike<A extends CommandArguments> =
  | Command<A>
  | ((call: ContextCall, args: A) => void)
type ModifiedCommandArguments<A, K, B> = {
  [P in Exclude<keyof A, K> | keyof B]: P extends keyof A ? A[P] : P extends keyof B ? B[P] : never
}

export class Command<A extends CommandArguments> {
  readonly uid: string = 'command-' + uuidv4()
  private name?: string
  private actions: ((call: ContextCall, args: A) => void)[]
  constructor(actions: ((call: ContextCall, args: A) => void)[]) {
    this.actions = actions
  }

  public setName(name: string) {
    if (this.name)
      throw Error(
        `Tried assigning name to a command which already had a name (old: ${this.name}, new: ${name})`
      )
    this.name = name
  }

  private callDirect(call: ContextCall, args: A) {
    if (this.name) console.debug(`Running ${this.name} with`, args)
    for (const action of this.actions) {
      action(call, args)
    }
  }

  public mapArg<
    K extends keyof A,
    B extends CommandArguments,
    F extends (args: ModifiedCommandArguments<A, K, B>) => A[K]
  >(parameter: K, mapping: F): Command<ModifiedCommandArguments<A, K, B>> {
    return new Command([
      (call, args) => {
        call(this, { ...args, [parameter]: mapping(args) } as A)
      }
    ])
  }

  public addPostCall(command: Command<A>): Command<A> {
    return new Command([
      (call, args: A) => {
        call(this, args)
      },
      (call: ContextCall, args: A) => call(command, args)
    ])
  }

  static combine<A extends CommandArguments>(...commands: CommandLike<A>[]): Command<A> {
    const funcs: ((call: ContextCall, args: A) => void)[] = []
    for (const command of commands) {
      if (command instanceof Command)
        funcs.push((call: ContextCall, args: A) => call(command, args))
      else funcs.push(command)
    }
    return new Command(funcs)
  }
}

export function enableCommandLogging(target: any) {
  for (const key in target) {
    if (target[key] instanceof Command) target[key].name = `${target.constructor.name}.${key}`
  }
}
