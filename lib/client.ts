import { createClient } from "edgedb";

const BASE_URL = process.env.EDGEDB_AUTH_BASE_URL;

export const client = createClient({
    tlsSecurity: process.env.NODE_ENV === "development" ? "insecure" : undefined,
});
