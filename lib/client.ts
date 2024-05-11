import { createClient, Client } from 'edgedb';


let client: Client;

if (process.env.NODE_ENV === 'development') {
  // TODO: TS hell
  // @ts-ignore
  if (!global.edgedbClient) {
  // @ts-ignore
    global.edgedbClient = createClient();
  }
  // @ts-ignore
  client = global.edgedbClient;
} else {
  client = createClient();
}

export default client;
