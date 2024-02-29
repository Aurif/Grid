export default class PresetUtil<T extends {}> {
    readonly values: T[]
    constructor(values: T[]) {
        this.values = values
    }

    private getByCache: {[key: string]: {[val: string]: number}} = {}
    public getBy<K extends keyof T & string>(key: K, value: T[K]): T {
        if (!this.getByCache[key]) {
            this.getByCache[key] = {}
            for(let i=0; i<this.values.length; i++)
                this.getByCache[key][''+this.values[i][key]] = i
        }
        return this.values[this.getByCache[key][''+value]]
    }
}