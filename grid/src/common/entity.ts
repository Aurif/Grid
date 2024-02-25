import type InputAcceptor from "@/input/input-acceptor"
import type { InputAcceptorSpawn } from "@/input/input-acceptor"
import { v4 as uuidv4 } from 'uuid';

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

export function anonymousEntity(): Entity {
    return new Entity("blank-"+uuidv4())
}