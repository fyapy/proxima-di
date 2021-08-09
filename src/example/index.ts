import { injectServiceA } from './serviceA'
import { injectServiceB } from './serviceB'

const serviceA = injectServiceA()
const serviceB = injectServiceB()

serviceA.getA('SOme a text')
serviceB.getB('Some b')
