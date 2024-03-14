export default class PresetUtil<T extends {}> {
  readonly values: T[]
  private getByCache: { [key: string]: { [val: string]: number } } = {}

  constructor(values: T[]) {
    this.values = values
  }

  public get length(): number {
    return this.values.length
  }

  public getBy<K extends keyof T & string>(key: K, value: T[K]): T {
    return this.values[this.getIndexBy(key, value)]
  }

  public getIndexBy<K extends keyof T & string>(key: K, value: T[K]): number {
    function asString(value: T[K]): string {
      if (value == undefined) return ''
      return '' + value
    }

    if (!this.getByCache[key]) {
      this.getByCache[key] = {}
      for (let i = 0; i < this.values.length; i++)
        this.getByCache[key][asString(this.values[i][key])] = i
    }

    const index = this.getByCache[key][asString(value)]
    if (index == undefined && value != undefined) return this.getIndexBy(key, undefined as T[K])
    if (index == undefined)
      throw Error(`There is no preset with "${key}" equal to "${value}" and no default value`)
    return index
  }

  public getAt(index: number): T {
    return this.values[index]
  }

  public getValuesOf<K extends keyof T & string>(key: K): T[K][] {
    return this.values.map((x) => x[key])
  }
}
