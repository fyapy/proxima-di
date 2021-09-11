export type Container = Map<string, any>
export type AnyObject = Record<string, any>

const noop = () => {}
type Noop = () => void

type Service<D = Noop, F = Noop> = {
  name: string
  inject: D
  clear: () => void
  fn: F
}



export const containerFactory = (container: Container) => {
  const service = <
    I extends Record<string, Service>,
    F extends (injects: Record<keyof I, ReturnType<I[keyof I]['inject']>>) => any
  >(name: string, injects: I, depFn: F) => {
    const proxyInjects = Object.entries(injects).reduce<AnyObject>((acc, [key, value]) => {
      if (key in acc) {
        throw new Error(`Injects with key '${key}' in service '${name}' already exist!`)
      }

      acc[key] = value.inject()

      return acc
    }, {}) as Parameters<F>[0]
    
    const inject = () => new Proxy<ReturnType<F>>(noop as unknown as ReturnType<F>, {
      apply(_, ctx, args) {
        if (container.has(name)) {
          return container.get(name).apply(ctx, args)
        }

        throw new Error(`Can't call service with name '${name}'!`);
      },
      get(_, prop: string) {
        if (container.has(name)) {
          return container.get(name)[prop]
        }
    
        throw new Error(`Can't resolve service '${name}'!`)
      }
    })

    const clear = () => clearService(name)

    if (container.has(name)) {
      throw new Error(`Service with name '${name}' already exist!`)
    }
    container.set(name, depFn(proxyInjects))

    return {
      inject,
      clear,
      name,
      fn: depFn,
    } as Service<() => ReturnType<F>, F>
  }

  const clearService = (name: string) => {
    if (container.has(name)) {
      return container.delete(name)
    }

    throw new Error(`Service with name '${name}' don't exist!`)
  }

  const clearAll = () => {
    for (const key of container.keys()) {
      container.delete(key)
    }
  }

  const debug = <D extends Service>(dep: D) => container.get(dep.name) as ReturnType<D['inject']>

  return {
    service,
    clearService,
    clearAll,
    debug,
  }
}

export const defaultContainer: Container = new Map()
export const { 
  service,
  clearAll,
  clearService,
  debug,
} = containerFactory(defaultContainer)
