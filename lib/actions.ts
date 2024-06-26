"use server";
import { cookies } from "next/headers";
import {client} from "@/lib/client"


// I appologize for what has happend in this file.

/* Update the current user's score in the db
*
*/
export async function updateGameStats(new_score: number, laser: number, enemy_collisions: number, friendly: number) {
    const cookieStore = cookies();
    const authToken = cookieStore.get("edgedb-auth-token")?.value
    if (!authToken) return undefined;
    client.withGlobals({"ext::auth::client_token": authToken}).querySingleJSON(`
        UPDATE User
        FILTER .id = global current_user.id
        SET {
            stats := (
                UPDATE Stat
                FILTER .id = global current_user.stats.id
                SET {
                    score := <int32>$new_score,
                    enemies_shot_down := <int32>$laser,
                    enemy_collisions := <int32>$enemy_collisions,
                    friendly_misses := <int32>$friendly
                }
            )
        };
    `, {new_score, laser, enemy_collisions, friendly});
}

/* Get the current user's stats and achiements
*
*/
export async function getUserStats() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("edgedb-auth-token")?.value
    if (!authToken) return undefined;
    const user = await client.withGlobals({"ext::auth::client_token": authToken}).querySingleJSON(`
    select User {
        stats: { enemy_collisions, friendly_misses, friendly_collisions, enemies_shot_down, score, total_game_time },
        achievements: {
            deez_nuts, skill_issues, brazil_mentioned, ocamel_mentioned, rust_mentioned, giga_chad, chad_stack, react_andy, tom_s_a_genius, devon, functional_programming_plus_tye_dye, hackerman, furries, squeel, falcore_mentioned, netflix_btw, arch, zig_mentioned, four_twenty, sixty_nine, real_talk, l_take, got_the_w, big_influencer_money, back_door_wang, five_dollars_a_month, in_shambles
        }
      }
      filter .id = global current_user.id
    `);
    console.log(`Got user: ${user}`);
    return user;
}

/* Create a new user if they are not in the DB
 *
*/
export async function createUserIfNotExists(name: string, identityId: string) {

    console.log(name, identityId);

  const user = await client.querySingle(`
  select User { name }
  filter .name = <str>$name;
  `, { name });

  if (!user) {
    try {
    await client.querySingle(`
        WITH
        new_stat := (
            INSERT default::Stat {
                score := 0,
                enemy_collisions := 0,
                friendly_collisions := 0,
                friendly_misses := 0,
                enemies_shot_down := 0,
                total_game_time := 0
            }
        ),
        new_achievement := (
            INSERT default::Achievement {
                deez_nuts := false,
                skill_issues := false,
                brazil_mentioned := false,
                ocamel_mentioned := false,
                rust_mentioned := false,
                giga_chad := false,
                chad_stack := false,
                react_andy := false,
                tom_s_a_genius := false,
                devon := false,
                functional_programming_plus_tye_dye := false,
                hackerman := false,
                furries := false,
                squeel := false,
                falcore_mentioned := false,
                netflix_btw := false,
                arch := false,
                zig_mentioned := false,
                four_twenty := false,
                sixty_nine := false,
                real_talk := false,
                l_take := false,
                got_the_w := false,
                big_influencer_money := false,
                back_door_wang := false,
                five_dollars_a_month := false,
                in_shambles := false
            }
        )
        INSERT default::User {
            name := <str>$name,
            identity := (SELECT ext::auth::Identity FILTER .id = <uuid>$identityId),
            stats := new_stat,
            achievements := new_achievement
        };
    `, {name, identityId});
    console.log("insertedUser");
    } catch (err) {
        console.error("error storing user: ", err);
  }
  } 
  console.log("user found? ", user);
}

/* Get users based on top scores
*
*/
export async function getTopScores() {
    const cookieStore = cookies();
    const authToken = cookieStore.get("edgedb-auth-token")?.value
    if (!authToken) return undefined;
    const scores = await client.withGlobals({"ext::auth::client_token": authToken}).querySingleJSON(`
    select User {
        name,
        stats: { score }
      }
    order by .stats.score desc
    limit 5
    `);
    console.log(`Got scores: ${scores}`);
    return scores;
}