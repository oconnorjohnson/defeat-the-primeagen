"use server";

import client from "./client"
import e from "@/dbschema/edgeql-js";

export async function updateGameStats()  {

    const users = e.select(e.User, () => ({
        id: true,
        username: true,
        email: true,
    }));

    return await users.run(client);
}