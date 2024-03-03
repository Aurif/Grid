import DataStore from './data-store'

export default class DataStoreTemporary<T extends {}> extends DataStore<T> {
  private data: T = {} as T
  get hook(): T {
    return this.data
  }
}
