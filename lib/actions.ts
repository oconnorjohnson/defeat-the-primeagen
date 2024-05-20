"use server";
import { cookies } from "next/headers";
import {client} from "@/lib/client"
// import {auth} from "./client"
// import e from "@/dbschema/edgeql-js";

export async function updateGameStats() {
    return 
}

export async function getUserStats() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("edgedb-auth-token")?.value
    if (!authToken) return undefined;
    const user = await client.withGlobals({"ext::auth::client_token": authToken}).querySingleJSON(`
    select User {
        stats: {
          name,
          number
        }
      }
      filter .id = global current_user.id
    `);
    console.log(`Got user: ${user}`);
    return user;
}

// export async function getUserSession() {
//     const session = await auth.getSession();

//     const isSignedIn = await session.isSignedIn();
//     console.log("in get user session");
//     console.log(isSignedIn);
// }

export async function createUserIfNotExists(name: string, identityId: string) {

    console.log(name, identityId);

  const user = await client.querySingle(`
  select User { name }
  filter .name = <str>$name;
  `, { name });

  if (!user) {
    try {
    // TODO: Create new user
    const insertedUser = await client.querySingle(`
    insert User { name := <str>$name,
         identity := (SELECT ext::auth::Identity FILTER .id = <uuid>$identityId)
         }`, {name, identityId});
    console.log("insertedUser: " + insertedUser);
    } catch (err) {
        console.error("error storing user: ", err);
  }
  } 
  console.log("user found? ", user);
}