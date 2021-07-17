
const container = {} as Record<string | symbol, any>

export const set = <T>(key: symbol, service: T) => {
  if (key in container) {
    throw new Error(`Service with ${key.description} already exist!`)
  }

  container[key as any] = service
}

export const inject = (key: symbol): Record<string, any> => new Proxy({}, {
  get(target, prop: string) {
    if (key in container) {
      return container[key as any][prop]
    }

    throw new Error(`Can't resolve service ${key.description}!`)
  }
})

// const createContainer = (initialState: Record<string, any> = {}) => {
//   const state = { ...initialState }

//   const set = <T>(key: symbol, service: T) => {
//     if (key.description in state) {
//       throw new Error(`Service with ${key.description} already exist!`)
//     }

//     state[key.description] = service
//   }

//   const inject = 

//   return {
//     set,
//     inject: 
//   }
// }
