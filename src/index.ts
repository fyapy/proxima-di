export type Signature = string | symbol
export type Container = Record<Signature, any>
export type AnyObject = Record<string, any>

const showSignature = (key: Signature) => typeof key === 'string'
  ? key
  : key.description

export const containerFactory = (container: Container) => {
  const provide = <P>(key: Signature, service: P) => {
    if (key in container) {
      throw new Error(`Service with ${showSignature(key)} already exist!`)
    }
  
    container[key as string] = service
  }

  const inject = <I extends AnyObject>(key: Signature): I => new Proxy<I>({} as I, {
    get(target, prop: string) {
      if (key in container) {
        return container[key as string][prop]
      }
  
      throw new Error(`Can't resolve service ${showSignature(key)}!`)
    }
  })

  return {
    provide,
    inject,
  }
}

export const defaultContainer = {} as Container
export const { inject, provide } = containerFactory(defaultContainer)
