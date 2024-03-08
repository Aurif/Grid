import { Command, type CommandArguments } from './command'

type Modifier<A extends CommandArguments, C> = (
  command: Command<A>,
  context: C
) => Command<A> | void
export class ContextClass<C> {
  private modifiers: { [key: string]: Modifier<any, C>[] } = {}
  registerModifier<A extends CommandArguments>(command: Command<A>, modifier: Modifier<A, C>) {
    if (!this.modifiers[command.uid]) this.modifiers[command.uid] = []
    this.modifiers[command.uid].push(modifier)
  }

  private disarmCommand<A extends CommandArguments>(command: Command<A>): Command<A> {
    return new Command([
      (call, args) => {
        command['callDirect'](call, args)
      }
    ])
  }

  private getModified<A extends CommandArguments>(
    command: Command<A>,
    context: C
  ): Command<A> | void {
    const commandUid = command.uid
    let currentCommand: void | Command<A> = this.disarmCommand(command)
    for (const modifier of this.modifiers[commandUid] || [])
      currentCommand = modifier(currentCommand as Command<A>, context)
    if (!currentCommand) return
    return currentCommand
  }

  make(value: C): ContextCall {
    const context = new Context(this, value)
    return context.call.bind(context) as ContextCall
  }
}

class Context<C> {
  private value: C
  private parent: ContextClass<C>
  private commandCache: { [commandUid: string]: Command<any> | void } = {}
  constructor(parent: ContextClass<C>, value: C) {
    this.parent = parent
    this.value = value
  }

  private getModified<A extends CommandArguments>(command: Command<A>): Command<A> | void {
    if (!this.commandCache[command.uid])
      this.commandCache[command.uid] = this.parent['getModified'](command, this.value)
    return this.commandCache[command.uid]
  }

  public call<A extends CommandArguments>(command: Command<A>, args: A): void {
    try {
      const modifiedCommand = this.getModified(command)
      if (modifiedCommand)
        modifiedCommand['callDirect'](this.call.bind(this) as ContextCall, args || {})
    } catch (e) {
      console.error(e)
    }
  }
}

export type ContextCall = Context<any>['call'] & { __comes_from_context: boolean }
export function blankContext(): ContextCall {
  return new ContextClass().make(null)
}

export function callOnInit<A extends CommandArguments>(command: Command<A>, args: A) {
  setTimeout(() => {
    blankContext()(command, args)
  }, 1)
}
