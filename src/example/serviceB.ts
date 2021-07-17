import { inject, set } from "../index"
import { DI } from "./di"

const serviceA = inject(DI.serviceA)

const getB = (textB: string) => {
  serviceA.getA('From get B')
  console.log(`${textB} from serviceB`)
}

const serviceB = {
  getB,
}

set(DI.serviceB, serviceB)
