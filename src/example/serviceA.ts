import { inject, set } from "../index"
import { DI } from "./di"

const serviceB = inject(DI.serviceB)

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

set(DI.serviceA, serviceA)
