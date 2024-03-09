import DataStore from './data-store'

export default class DataStoreTemporary<T extends {}> extends DataStore<T> {
  private data: T
  constructor(data: T = {} as T) {
    super()
    this.data = { ...data }
  }
  get hook(): T {
    return this.data
  }
}
