import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "node:crypto";
import { Stat } from "@/lib/interfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a random Base64 url-encoded string, and derive a "challenge"
 * string from that string to use as proof that the request for a token
 * later is made from the same user agent that made the original request
 *
 * @returns {Object} The verifier and challenge strings
 */
type PKCE = {
  verifier: string;
  challenge: string;
};
export const generatePKCE = (): PKCE => {
  const verifier = crypto.randomBytes(32).toString("base64url");
  console.log("verifier length before ", verifier.length);

  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");

  console.log("verifier length after ", verifier.length);
  return { verifier, challenge };
};

export function evaluateStats(stats: Stat): string[] | undefined {
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

  if (achievementsUpdates.length === 0) return;

  return achievementsUpdates;
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
