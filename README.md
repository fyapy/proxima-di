# Proxima-DI

> Functional style dependency injection library for TypeScript and JavaScript.

- 💡 Intuitive
- 📦 Completely native
- 🏗 Transpiler agnostic
- 🔑 Type Safe

## Installation

```bash
yarn add proxima-di
# or with npm
npm install proxima-di
```

## Documentation

To learn more about Proxima-DI, check [its documentation](https://proxima-di.netlify.app/).

## Usage

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

## License

[MIT](http://opensource.org/licenses/MIT)
