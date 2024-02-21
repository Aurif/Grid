import type Input from "./input"

export default class InputAcceptor {
    actions: {[input: string]: ((target: InputAcceptorSpawn) => void)[]} = {}
    on(input: Input, action: (target: InputAcceptorSpawn) => void): this {
        let key = input.uid
        if (!this.actions[key]) this.actions[key] = []
        this.actions[key].push(action)

        return this
    }
    trigger(input: Input, target: InputAcceptorSpawn) {
        for(let action of (this.actions[input.uid] || []))
            action(target)
    }
    spawn(id: string): InputAcceptorSpawn {
        return new InputAcceptorSpawn(this, id)
    }
}

class InputAcceptorSpawn {
    private owner: InputAcceptor
    id: string

    constructor(owner: InputAcceptor, id: string) {
        this.owner = owner
        this.id = id
    }
    trigger(input: Input) { this.owner.trigger(input, this) }
}
export type { InputAcceptorSpawn }