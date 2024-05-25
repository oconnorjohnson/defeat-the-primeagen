import {cookies} from "next/headers";
import {client} from "./client"
import { evaluateStats } from "./utils";

export interface Stat {
    score: number;
    enemy_collisions: number;
    friendly_collisions: number;
    friendly_misses: number;
    enemies_shot_down: number;
    total_game_time: number;
}

export interface Achievement {
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

export async function updateAchievements(stats: Stat) {

    const achievementsUpdates: string[] | undefined = evaluateStats(stats);

    if (!achievementsUpdates) return;
    if (achievementsUpdates.length == 0) return;

    const updateQuery = updateAchievementsQuery(achievementsUpdates);
    const cookieStore = cookies();
    const authToken = cookieStore.get("edgedb-auth-token")?.value
    if (!authToken) return undefined;

    client.withGlobals({"ext::auth::client_token": authToken}).querySingle(updateQuery)

}

export function updateAchievementsQuery(achievementsUpdates: string[]): string {
return `
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

}