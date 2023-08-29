// @ts-check

/**
 * 
 * @returns {Promise<string>}
 */
async function sampleWebSocket() {
  return new Promise((resolve) => {
    const ws = new WebSocket('ws://echo.websocket.events/');
    ws.addEventListener('open', (event) => {
      console.log('ws open');
      ws.send('Hello, world!');
    });
    ws.addEventListener('message', (event) => {
      console.log('message', event.data);
      ws.close();
      resolve(String(event.data));
    });
  });
} 

// Worker
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    switch (url.pathname) {
      case '/fetch': {
        const result = await sampleWebSocket();
        return new Response(result);
      }
      case '/do': {
        let id = env.SAMPLE.idFromName('A');
        let obj = env.SAMPLE.get(id);
        let resp = await obj.fetch(request.url);

        return new Response(await resp.text());
      }
      default:
        return new Response('Use /fetch or /do');
    }
  },
};

// Durable Object
/** @implements {DurableObject} */
export class Sample {
  /** @type {string} */ #value;

  constructor(state, env) {
    state.blockConcurrencyWhile(async () => {
      this.#value = await sampleWebSocket();
    });
  }

  // Handle HTTP requests from clients.
  async fetch(request) {
    return new Response(this.#value);
  }
}
