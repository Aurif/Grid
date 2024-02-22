import type InputAcceptor from "@/input/input-acceptor"
import type { InputAcceptorSpawn } from "@/input/input-acceptor"

export default class Entity {
    readonly uid: string
    inputAcceptor?: InputAcceptorSpawn

    constructor(uid: string) {
        this.uid = uid
    }

    withInput(inputAcceptor: InputAcceptor): this {
        this.inputAcceptor = inputAcceptor.spawn(this)
        return this
    }
}