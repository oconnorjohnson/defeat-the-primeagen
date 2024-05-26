"use server";
import { cookies } from "next/headers";
import { client } from "./client";
import { evaluateStats } from "./utils";
import { updateAchievementsQuery } from "./utils";
import { Stat, Achievement } from "./interfaces";

export async function updateAchievements(stats: Stat) {
  const achievementsUpdates: string[] | undefined = evaluateStats(stats);

  if (!achievementsUpdates) return;
  if (achievementsUpdates.length == 0) return;

  const updateQuery = updateAchievementsQuery(achievementsUpdates);
  const cookieStore = cookies();
  const authToken = cookieStore.get("edgedb-auth-token")?.value;
  if (!authToken) return undefined;

  client
    .withGlobals({ "ext::auth::client_token": authToken })
    .querySingle(updateQuery);
}
