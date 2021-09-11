# Getting Started

## Quick Start

To start using Proxima-di run the following command:

<code-group>
<code-block title="YARN" active>
```bash
yarn add proxima-di
```
</code-block>

<code-block title="NPM">
```bash
npm install proxima-di
```
</code-block>
</code-group>

## Basic Usage

Create a simple service:

```ts
import { service } from 'proxima-di'

export const WebPushService = service('web-push-service', {}, () => {
    const notify = (subscriptions: string[], somePayload: unknown) => {
        // implementation
    }

    return {
        notify,
    }
})
```

Create a service what inject other services:

```ts
import { service } from 'proxima-di'

const AuthService = service('auth-service', {
    webPushService: WebPushService, // inject WebPushService service
    userService: UserService, // inject some other service
}, ({ pushService, userService }) => {
    // Don't return a method to make it private
    const comapreHash = (string: string, hash: string) => true // implementation
    const generateTokens = (id: string) => ({
        tokens: {}, // implementation
    })

    const login = async (dto: LoginDTO) => {
        const user = // find implementation

        if (!comapreHash(dto.password, user.passwordHash)) {
            // Catch error
        }

        // First authorization from a new device
        if (isNewDevice) {
            webPushService.notify(user.subscriptions, 'Some additional payload')
        }

        // All good
        return {
            ...generateTokens(user.id),
            ...userService.mapUserActivity(user),
        }
    }

    return {
        login,
    }
})
```

Use the service in a controller (for example Fastify plugin) or anywhere else:

```ts
import type { FastifyPluginCallback } from 'fastify'

// In fastify plugin
const authController: FastifyPluginCallback = (fastify, opts, done) => {
    // we request an instance of AuthService from Proxima-di
    const authService = AuthService.inject()

    fastify.post<{ Body: DTO }>('/login', async ({ body }) => {
        // And use it in your request handler
        const output = await authService.login(body)

        return output
    })
}
```

## Custom DI Container

If you need a custom container or split your logic into several containers, then the [containerFactory](/docs/api.html#containerfactory) method will help you:

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
