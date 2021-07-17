import { inject } from '..'
import { DI } from './di'

const serviceA = inject(DI.serviceA)
const serviceB = inject(DI.serviceB)

import './serviceA'
import './serviceB'

serviceA.getA('SOme a text')
serviceB.getB('Some b')
