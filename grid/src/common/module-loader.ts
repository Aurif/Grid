export default class ModuleLoader<T extends {}> {
  readonly paramSpace: T
  private constructor(paramSpace: T) {
    this.paramSpace = paramSpace
  }

  public static init(): ModuleLoader<{}> {
    return new ModuleLoader({})
  }

  public run<N extends {} | void, E extends {} | undefined>(
    module: (params: T & E) => N,
    extraParams?: E
  ): ModuleLoader<T & N> {
    return new ModuleLoader({
      ...this.paramSpace,
      ...module({ ...this.paramSpace, ...(extraParams as E) })
    })
  }
}
