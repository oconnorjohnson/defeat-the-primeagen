"use server";
import {client} from "@/lib/client"
import {auth} from "./client"
import e from "@/dbschema/edgeql-js";

export async function updateGameStats() {
    return 
}

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
         identity := (insert ext::auth::Identity { id := <uuid><str>$identityId, provider := "Github"})
         }`, {name, identityId});
    console.log("insertedUser: " + insertedUser);
    } catch (err) {
        console.error("error storing user: ", err);
  }
  } 
  console.log("user found? ", user);
    // const user = e.select(e.User, () => ({
    //     name: true,
    //     filter_single: e.op(name, "=", 'name'),
    // }))

    // const u = await user.run(client);
    // console.log("found user");

    // if (!u) {
    //   console.log("inserting user");
    //     e.insert(e.User, {
    //         name,
    //         identity: e.assert_exists(
    //           e.select(e.ext.auth.Identity, () => ({
    //             filter_single: { id: e.uuid(identity_id) },
    //           }))
    //         ),
    //       });
    // }
}