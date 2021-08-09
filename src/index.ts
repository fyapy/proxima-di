export type Signature = string | symbol
export type Container = Record<Signature, any>
export type AnyObject = Record<string, any>

const noop = () => {}
const showSignature = (key: Signature) => typeof key === 'string'
  ? key
  : key.description

export const containerFactory = (container: Container) => {
  const provide = <P>(key: Signature, service: P) => {
    if (key in container) {
      throw new Error(`Dependency with ${showSignature(key)} already exist!`)
    }
  
    container[key as string] = service
  }

  const inject = <I extends AnyObject>(key: Signature): I => new Proxy<I>(noop as unknown as I, {
    apply(_, ctx, args) {
      if (key in container) {
        return container[key as string].apply(ctx, args)
      }

      throw new Error(`Can't call dependency ${showSignature(key)}!`);
    },
    get(_, prop: string) {
      if (key in container) {
        return container[key as string][prop]
      }
  
      throw new Error(`Can't resolve dependency ${showSignature(key)}!`)
    }
  })

  return {
    provide,
    inject,
  }
}

export const defaultContainer = {} as Container
const proxima = containerFactory(defaultContainer)

export const {
  provide,
  inject,
} = {
  inject: proxima.inject,
  provide: proxima.provide,
}
export default proxima
