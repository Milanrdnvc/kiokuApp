export type SM2Grade = 0 | 1 | 2 | 3 | 4 | 5;

export interface SM2State {
  repetitions: number;
  easeFactor: number;

  reps: number;
  lapses: number;

  interval: number;
}

export interface SM2Result extends SM2State {
  nextReviewDate: Date;
}

const INITIAL_SM2_STATE: SM2State = {
  repetitions: 0,
  reps: 0,
  lapses: 0,
  interval: 0,
  easeFactor: 2.5,
};

export function calculateSM2(
  currentState: SM2State = INITIAL_SM2_STATE,
  grade: SM2Grade,
  now: Date = new Date(),
): SM2Result {
  if (grade < 0 || grade > 5) {
    throw new Error("Grade must be between 0 and 5.");
  }

  const { repetitions, reps, lapses, interval, easeFactor } = currentState;

  const q = grade;
  let newEaseFactor = Math.max(
    1.3,
    easeFactor + (-0.02 * q * q + 0.28 * q - 0.8),
  );

  let newRepetitions: number;
  let newInterval: number;
  let newLapses = lapses;

  if (grade >= 3) {
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }
    newRepetitions = repetitions + 1;
  } else {
    newRepetitions = 0;
    newInterval = 1;
    newLapses += 1;
  }

  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    interval: newInterval,
    nextReviewDate,

    repetitions: newRepetitions,
    easeFactor: Math.round(newEaseFactor * 100) / 100,

    reps: reps + 1,
    lapses: newLapses,
  };
}
