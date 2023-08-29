# Context

This repository is a simple Cloudflare Worker demonstrating an issue with WebSockets when used in a Durable Object context.

The `/fetch` route will instantiate a WebSocket, wait for a message and return.
This works as expected.

For the `/do` route the same WebSocket code is run in the `state.blockConcurrencyWhile` guard in the Durable Object constructor.
This will lead to the following error when the request is made:
`Error: A call to blockConcurrencyWhile() in a Durable Object waited for too long. The call was canceled and the Durable Object was reset.`

# How to run
> `npm install && npm run start`