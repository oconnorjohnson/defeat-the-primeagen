export default function calculateFinalScore(
  enemiesKilled: number,
  totalGameTime: number,
  friendlyCaught: number,
  friendlyMissed: number
): number {
  const MAX_ENEMIES_KILLED = 100;
  const MAX_GAME_TIME_SECONDS = 3600; // in seconds (1 hour)
  const MAX_FRIENDLY_ACCEPTANCE_RATE = 1; // 100%

  // score var weightings
  const WEIGHT_EK = 0.4;
  const WEIGHT_TGT = 0.3;
  const WEIGHT_FAR = 0.3;

  // convert TGT to seconds
  const totalGameTimeSeconds = totalGameTime / 1000;

  // calc FAR
  let far: number;
  if (friendlyCaught + friendlyMissed === 0) {
    far = 0; // avoid dividing by zero
  } else {
    far = friendlyCaught / (friendlyCaught + friendlyMissed);
  }

  // normalize scores
  const ekNormalized = enemiesKilled / MAX_ENEMIES_KILLED;
  const tgtNormalized = totalGameTimeSeconds / MAX_GAME_TIME_SECONDS;
  const farNormalized = far;

  // weighted scores
  const weks = ekNormalized * WEIGHT_EK;
  const wtgt = tgtNormalized * WEIGHT_TGT;
  const wfars = farNormalized * WEIGHT_FAR;

  // final score
  const finalScore = weks + wtgt + wfars;

  return finalScore;
}
