import { createClient } from "edgedb";
//import createAuth from "@edgedb/auth-nextjs/app";

const BASE_URL = process.env.EDGEDB_AUTH_BASE_URL;

export const client = createClient({
    tlsSecurity: process.env.NODE_ENV === "development" ? "insecure" : undefined,
});

// export const auth = createAuth(client, {
//   baseUrl: BASE_URL || "",
// });