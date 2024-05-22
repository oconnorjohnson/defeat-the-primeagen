import { atom } from "jotai";

export const triggerRightThumbAtom = atom(false);
export const triggerRightIndexAtom = atom(false);
export const triggerRightRingAtom = atom(false);
export const triggerRightPinkyAtom = atom(false);
export const triggerLeftThumbAtom = atom(false);
export const triggerLeftIndexAtom = atom(false);
export const triggerLeftRingAtom = atom(false);
export const triggerLeftPinkyAtom = atom(false);
export const viewportDimensionsAtom = atom({ width: 800, height: 600 });
export const gamePausedAtom = atom(false);
export const gameStartedAtom = atom(false);

// GAME STATE ATOMS
export const scoreAtom = atom(0);
export const enemiesKilledWithLaserAtom = atom(0);
export const enemiesCollidedWithAtom = atom(0);
export const acceptedRateAtom = atom(0);
export const totalFriendliesPassedAtom = atom(0);
export const hitRateAtom = atom(0);
