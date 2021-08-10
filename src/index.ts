export type Signature = string | symbol
export type Container = Record<Signature, any>
export type AnyObject = Record<string, any>

const noop = () => {}
const showSignature = (key: Signature) => typeof key === 'string'
  ? key
  : key.description

export const containerFactory = (container: Container) => {
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
  
    return {
      provide,
      inject,
    }
  }

  return {
    newDependency,
  }
}

export const defaultContainer = {} as Container
export const { newDependency } = containerFactory(defaultContainer)
