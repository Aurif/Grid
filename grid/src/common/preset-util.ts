export default class PresetUtil<T extends {}> {
    readonly values: T[]
    constructor(values: T[]) {
        this.values = values
    }

    private getByCache: {[key: string]: {[val: string]: number}} = {}
    public getBy<K extends keyof T & string>(key: K, value: T[K]): T {
        return this.values[this.getIndexBy(key, value)]
    }
    public getIndexBy<K extends keyof T & string>(key: K, value: T[K]): number {
        if (!this.getByCache[key]) {
            this.getByCache[key] = {}
            for(let i=0; i<this.values.length; i++)
                this.getByCache[key][''+this.values[i][key]] = i
        }
        return this.getByCache[key][''+value]
    }

    public getAt(index: number): T {
        return this.values[index]
    }
}