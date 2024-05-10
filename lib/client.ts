import { createClient, Client } from 'edgedb';


let client: Client;

if (process.env.NODE_ENV === 'development') {
  // TODO: TS hell
  if (!global.edgedbClient) {
    global.edgedbClient = createClient();
  }
  client = global.edgedbClient;
} else {
  client = createClient();
}

export default client;
