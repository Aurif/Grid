export default class PresetUtil<T extends {}> {
    readonly values: T[]
    constructor(values: T[]) {
        this.values = values
    }
}