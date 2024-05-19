# rootz express-ts boilerplate

This is a boilerplate for express-ts project.

## Features

- [x] Automatic routes registration, no need to manually add routes to the app. Just create a file in the routes folder and follow the `RouteOption` interface to define your route.

- [x] Automatic middleware registration. Just like routes, create a file in the middleware folder and follow the `MiddlewareOption` interface to define your middleware.

- [x] Configurable environment variables. Use config.ts to add different client configurations with typing support, all in one place.

## Getting Started

### Dependencies

- [Node.js](https://nodejs.org/en/download/)
- [Redis](https://redis.io/download)
- [Mongo DB](https://www.mongodb.com/try/download/community)

### Steps

1. Fetch the project as boilerplate

```bash
npx rootz-express-ts-boilerplate <project-name>
```

2. Install dependencies

```bash
cd my-app
npm install
```

3. Start the server

```bash
npm run dev:server
```

4. Start the worker (in a separate terminal, optional)

```bash
npm run dev:worker
```

5. Open the browser and navigate to `http://localhost:<PORT>/api/hello`

6. You should see a response from the server & terminal logs from the worker and middleware as PoC that they are being executed.

## Server - Worker Architecture

This boilerplate uses a server-worker architecture. The server is responsible for handling incoming requests and the worker is responsible for processing the requests. This architecture allows the server to be free from processing heavy tasks and focus on handling incoming requests.

### Server

The server is connected to the worker through a message queue (Redis channel). The server listens to incoming requests and sends the request to the worker for processing. The server doesn't wait for the worker to finish processing the request, it immediately sends a response to the client.

### Worker

- The worker subscribes to the message queue and listens for incoming messages. When a message is received, the worker processes the payload.

- The worker doesn't have access to the request object, so it can't send a response to the client. Make sure these tasks are asynchronous and don't require a response for end user.

## Components

### Middleware

- Middleware is a function that runs before the route handler. It can be used to perform tasks like logging, authentication, etc.

- Default project comes with a sample middleware that logs the request method, url, and response time.

- `path`: You can also define path specific middleware by adding a path in the middleware options.

- `prioirty`: Middleware can be executed in a specific order by setting the priority. Lower the number, higher the priority.

- `func`: Middleware function that runs before the route handler, it takes 4 arguments: `req`, `res`, `next`, `content`.

- `context`: Middleware is also able to access the context object which contains the instance of services like `redis`, `mongo`, etc.

### Routes

- Routes are automatically registered by the server. Just create a file in the routes folder and follow the `RouteOption` interface to define your route.

- To generate a route, you can use the `generate-route` command.

```bash
npx rootz-express-ts-boilerplate generate-route <route-name>
```
