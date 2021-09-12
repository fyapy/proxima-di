# API

## service

Container method for defining a new service.

**Params**

| Property | Type       | Description          |
| -------- |:-----------|:---------------------|
| name     | `string`   | Name for service in container (Unique).  |
| injects  | `Record<string, ReturnType<service>>`  | Injected services.       |
| service  | `(injects: Record<keyof I, ReturnType<I[keyof I]['inject']>>) => any` | Service function.     |

**Returns**

| Property | Type       | Description          |
| -------- |:-----------|:---------------------|
| name     | `string`   | The name under which the service was registered.  |
| clear  | `() => void`  | Function that will remove a service from container.       |
| fn  | `(injects: Record<keyof I, ReturnType<I[keyof I]['inject']>>) => any` | Service function from params. Can be used to write tests (Jest or other).     |
| inject  | `() => any` | A function that allows you to access the service.     |
| reset  | `<I extends Record<string, ReturnType<service>>, F extends (injects: Record<keyof I, ReturnType<I[keyof I]['inject']>>) => any>(injects: I, service: F) => any` | A function that will call the cleanup method and reset the service with a new value.     |

### Define service

```ts
import * as Sentry from '@sentry/node'
import { service } from 'proxima-di'
import pino from 'pino'

export const Logger = service('logger', {}, () => {
  Sentry.init({
    dsn: config.sentryDns,
    environment: config.nodeEnv,
  })

  const logger = pino({
    prettyPrint: isDevelopment,
    level: 'debug',
    hooks: {
      logMethod(inputArgs, method, level) {
        if (PinoFatalLevel <= level) {
          Sentry.captureException(inputArgs)
        }
        return method.apply(this, inputArgs)
      },
    },
  })

  return logger
})
```

### Use service in other service

```ts
import * as Sentry from '@sentry/node'
import { service } from 'proxima-di'
import pino from 'pino'

export const AuthService = service('auth-service', {
  logger: Logger,
}, ({ logger }) => {
  // Cannot be called at the time of initialization.
  // Only inside methods.
  console.log(logger.log('error')) // Error!!!

  const login = (dto: DTO) => {
    try {
      // login implementation
    } catch (err) {
      logger.fatal({ err }, 'Login failed!')
      throw new HttpError(401)
    }
  }

  return {
    login,
  }
})
```

### Service usage
**fastify example**

```ts
import type { FastifyPluginCallback } from 'fastify'

// In fastify plugin
const authController: FastifyPluginCallback = (fastify, opts, done) => {
    // we request an instance of AuthService from Proxima-di
    const authService = AuthService.inject()

    fastify.post<{ Body: DTO }>('/login', async ({ body }) => {
        const output = await authService.login(body)

        return output
    })
}
```

## clearService

Container method for remove a registed service from container.

**Params**

| Property | Type       | Description          |
| -------- |:-----------|:---------------------|
| name     | `string`   | The name of registed service.  |

### Remove service

```ts
import * as Sentry from '@sentry/node'
import { clearService } from 'proxima-di'
import pino from 'pino'

export const SomeService = service('some-service', {}, () => {
  const someSpecificCase = () => {
    try {

    } catch () {
      clearService('notifier') // will remove service from container
    }
  }

  return logger
})
```

## clearAll

Container method for remove all registed services from container.

### Remove all services

```ts
import * as Sentry from '@sentry/node'
import { clearAll } from 'proxima-di'
import pino from 'pino'

export const SomeService = service('some-service', {}, () => {
  // will remove all services from container
  const someSpecificCase = () => clearAll()

  return logger
})
```

## debug

Since all services are hidden behind a proxy, you will not be able to get direct access to them. This method will help you get direct access to the service object.

**Params**

| Property | Type       | Description          |
| -------- |:-----------|:---------------------|
| name     | `string`   | Service name.  |

**Returns**

Service object.

### Get direct access to service

```ts
import * as Sentry from '@sentry/node'
import { debug } from 'proxima-di'
import pino from 'pino'

export const SomeService = service('some-service', {
  logger: Logger,
}, ({ logger }) => {
  const someSpecificCase = () => {
    console.log(Logger) // Function: [noop]

    // Service object if exist
    console.log(debug(Logger.name)) // Logger service object
  }

  // Cannot be called at the time of initialization.
  console.log(debug(Logger.name)) // Error!!!

  return logger
})
```

## containerFactory

Method for creating a new DI container.

**Params**

| Property | Type       | Description          |
| -------- |:-----------|:---------------------|
| container     | `Map<string, any>`   | New container.  |

**Returns**

| Property |
| -------- |
| [service](/docs/api.html#service)  |
| [clearAll](/docs/api.html#clearall) |
| [clearService](/docs/api.html#clearservice)    |
| [debug](/docs/api.html#debug)     |

### Create custom DI container

```ts
import { containerFactory } from 'proxima-di'

const customContainer = new Map<string, any>()

export const {
  service,
  clearAll,
  clearService,
  debug,
} = containerFactory(customContainer)
```
