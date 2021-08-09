import type { ServiceA } from "./serviceA"
import { inject, provide } from "../index"
import { DI } from "./di"

const serviceA = inject<ServiceA>(DI.serviceA)

const getB = (textB: string) => {
  serviceA.getA('From get B')
  console.log(`${textB} from serviceB`)
}

const serviceB = {
  getB,
}
export type ServiceB = typeof serviceB
export const injectServiceB = () => inject<ServiceB>(DI.serviceB)

provide(DI.serviceB, serviceB)
