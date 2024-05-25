import { atom } from "jotai";

export const viewportDimensionsAtom = atom({ width: 800, height: 600 });
export const gamePausedAtom = atom(false);
export const gameStartedAtom = atom(false);
export const scoreAtom = atom(0);
export const enemiesKilledWithLaserAtom = atom(0);
export const enemiesCollidedWithAtom = atom(0);
export const acceptanceRateAtom = atom(0);
export const totalFriendliesPassedAtom = atom(0);
export const hitRateAtom = atom(0);
