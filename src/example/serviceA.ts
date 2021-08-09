import type { ServiceB } from "./serviceB"
import { inject, provide } from "../index"
import { DI } from "./di"

const serviceB = inject<ServiceB>(DI.serviceB)

let count = 0

const getA = (textA: string) => {
  if (count === 3) {
    return
  }
  count++
  serviceB.getB('from a service')
  console.log(`${textA} from serviceA`)
}

const serviceA = {
  getA,
}
export type ServiceA = typeof serviceA
export const injectServiceA = () => inject<ServiceA>(DI.serviceA)

provide(DI.serviceA, serviceA)
