export default abstract class DataStore<T extends {}> {
  abstract get hook(): T
}
