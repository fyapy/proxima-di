export type Signature = string | symbol
export type Container = Record<Signature, any>
export type AnyObject = Record<string, any>

const noop = () => {}
const showSignature = (key: Signature) => typeof key === 'string'
  ? key
  : key.description

export const containerFactory = (container: Container) => {
  const clearDependency = (key: Signature) => {
    const name = showSignature(key)

    if (key in container) {
      delete container[key as string]
      return
    }

    throw new Error(`Dependency with ${name} don't exist!`)
  }

  const clearAll = () => Object.keys(container).forEach(key => delete container[key])

  const newDependency = <P extends AnyObject>(key: Signature = Symbol()) => {
    const name = showSignature(key)

    const provide = (service: P) => {
      if (key in container) {
        throw new Error(`Dependency with ${name} already exist!`)
      }
    
      container[key as string] = service
    }
  
    const inject = () => new Proxy<P>(noop as unknown as P, {
      apply(_, ctx, args) {
        if (key in container) {
          return container[key as string].apply(ctx, args)
        }
  
        throw new Error(`Can't call dependency ${name}!`);
      },
      get(_, prop: string) {
        if (key in container) {
          return container[key as string][prop]
        }
    
        throw new Error(`Can't resolve dependency ${name}!`)
      }
    })

    const clear = () => clearDependency(key)
  
    return {
      provide,
      inject,
      clear,
    }
  }

  return {
    newDependency,
    clearDependency,
    clearAll,
  }
}

export const defaultContainer = {} as Container
export const { newDependency } = containerFactory(defaultContainer)
