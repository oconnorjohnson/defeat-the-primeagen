import {cookies} from "next/headers";
import {client} from "@/lib/client"

interface Stat {
    score: number;
    enemy_collisions: number;
    friendly_collisions: number;
    friendly_misses: number;
    enemies_shot_down: number;
    total_game_time: number;
}

interface Achievement {
    deez_nuts: boolean;
    skill_issues: boolean;
    brazil_mentioned: boolean;
    ocamel_mentioned: boolean;
    rust_mentioned: boolean;
    giga_chad: boolean;
    chad_stack: boolean;
    react_andy: boolean;
    tom_s_a_genius: boolean;
    devon: boolean;
    functional_programming_plus_tye_dye: boolean;
    hackerman: boolean;
    furries: boolean;
    squeel: boolean;
    falcore_mentioned: boolean;
    netflix_btw: boolean;
    arch: boolean;
    zig_mentioned: boolean;
    four_twenty: boolean;
    sixty_nine: boolean;
    real_talk: boolean;
    l_take: boolean;
    got_the_w: boolean;
    big_influencer_money: boolean;
    back_door_wang: boolean;
    five_dollars_a_month: boolean;
    in_shambles: boolean;
}

async function updateAchievements(stats: Stat) {

    const achievementsUpdates: string[] = [];


    if (stats.score === 4 && stats.enemy_collisions === 1) {
        achievementsUpdates.push("deez_nuts := true");
    }
    if (stats.score === 69) {
        achievementsUpdates.push("sixty_nine := true");
    }
    if (stats.score === 420) {
        achievementsUpdates.push("four_twenty := true");
    }
    if (stats.friendly_misses > 10) {
        achievementsUpdates.push("skill_issues := true");
    }
    if (stats.enemies_shot_down > 100) {
        achievementsUpdates.push("hackerman := true");
    }
    if (stats.total_game_time > 3600) {
        achievementsUpdates.push("netflix_btw := true");
    }
    if (stats.enemy_collisions > 5 && stats.friendly_collisions > 5) {
        achievementsUpdates.push("in_shambles := true");
    }
    if (stats.score === 0) {
        achievementsUpdates.push("l_take := true");
    }
    if (stats.score === 1) {
        achievementsUpdates.push("got_the_w := true");
    }
    if (stats.enemy_collisions === 2) {
        achievementsUpdates.push("furries := true");
    }
    if (stats.enemies_shot_down === 0) {
        achievementsUpdates.push("react_andy := true");
    }
    if (stats.friendly_collisions === 1) {
        achievementsUpdates.push("falcore_mentioned := true");
    }
    if (stats.friendly_misses === 3) {
        achievementsUpdates.push("chad_stack := true");
    }
    if (stats.total_game_time < 60) {
        achievementsUpdates.push("arch := true");
    }
    if (stats.enemies_shot_down === 50) {
        achievementsUpdates.push("big_influencer_money := true");
    }
    if (stats.enemy_collisions === 7) {
        achievementsUpdates.push("ocamel_mentioned := true");
    }
    if (stats.friendly_misses === 4) {
        achievementsUpdates.push("functional_programming_plus_tye_dye := true");
    }
    if (stats.enemies_shot_down === 42) {
        achievementsUpdates.push("zig_mentioned := true");
    }
    if (stats.total_game_time === 123) {
        achievementsUpdates.push("real_talk := true");
    }
    if (stats.friendly_collisions === 0) {
        achievementsUpdates.push("devon := true");
    }
    if (stats.score === 13) {
        achievementsUpdates.push("tom_s_a_genius := true");
    }
    if (stats.enemies_shot_down === 10) {
        achievementsUpdates.push("brazil_mentioned := true");
    }
    if (stats.total_game_time === 1000) {
        achievementsUpdates.push("back_door_wang := true");
    }

    if (achievementsUpdates.length > 0) {

    // Constructing the database query
    const updateQuery = `
        UPDATE User
        FILTER .id = global current_user.id
        SET {
            achievements := (
                UPDATE Achievement
                FILTER .id = global current_user.achievements.id
                SET {
                    ${achievementsUpdates.join(",\n")}
                }
            )
        };
    `;

    const cookieStore = cookies();
    const authToken = cookieStore.get("edgedb-auth-token")?.value
    if (!authToken) return undefined;

    client.withGlobals({"ext::auth::client_token": authToken}).querySingle(updateQuery)

    }
}

// Mock function to represent executing the query in your database
async function executeQuery(query: string) {
    // Implementation of your database query execution
    console.log("Executing query:", query);
}

async function updateDbAchievements(new_score: number, laser: number, enemy_collisions: number, friendly: number) {
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