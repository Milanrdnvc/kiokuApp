const W: number[] = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575,
  0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655,
  0.6621,
];

const F: number = 19.0 / 81.0;
const C: number = -0.5;

export type FSRSGrade = 1 | 2 | 3 | 4;

function retrievability(t: number, s: number): number {
  return Math.pow(1.0 + F * (t / s), C);
}

function interval(rd: number, s: number): number {
  return (s / F) * (Math.pow(rd, 1.0 / C) - 1.0);
}

function s0(g: FSRSGrade): number {
  return W[g - 1];
}

function sSuccess(d: number, s: number, r: number, g: FSRSGrade): number {
  const t_d = 11.0 - d;
  const t_s = Math.pow(s, -W[9]);
  const t_r = Math.exp(W[10] * (1.0 - r)) - 1.0;
  const h = g === 2 ? W[15] : 1.0;
  const b = g === 4 ? W[16] : 1.0;
  const alpha = 1.0 + t_d * t_s * t_r * h * b * Math.exp(W[8]);
  return s * alpha;
}

function sFailure(d: number, s: number, r: number): number {
  const d_f = Math.pow(d, -W[12]);
  const s_f = Math.pow(s + 1.0, W[13]) - 1.0;
  const r_f = Math.exp(W[14] * (1.0 - r));
  const result = d_f * s_f * r_f * W[11];
  return Math.min(result, s);
}

function stability(d: number, s: number, r: number, g: FSRSGrade): number {
  if (g === 1) {
    return sFailure(d, s, r);
  }
  return sSuccess(d, s, r, g);
}

function clampD(d: number): number {
  return Math.min(Math.max(d, 1.0), 10.0);
}

function d0(g: FSRSGrade): number {
  return clampD(W[4] - Math.exp(W[5] * (g - 1.0)) + 1.0);
}

function deltaD(g: FSRSGrade): number {
  return -W[6] * (g - 3.0);
}

function dPrime(d: number, g: FSRSGrade): number {
  return d + deltaD(g) * ((10.0 - d) / 9.0);
}

function difficulty(d: number, g: FSRSGrade): number {
  return clampD(W[7] * d0(4) + (1.0 - W[7]) * dPrime(d, g));
}

export interface FSRSState {
  stability: number;
  difficulty: number;

  reps: number;
  lapses: number;

  interval: number;
}

export interface FSRSResult extends FSRSState {
  nextReviewDate: Date;
}

const INITIAL_FSRS_STATE: FSRSState = {
  stability: 0,
  difficulty: 0,
  reps: 0,
  lapses: 0,
  interval: 0,
};

export function calculateFSRS(
  currentState: FSRSState = INITIAL_FSRS_STATE,
  grade: FSRSGrade,
  elapsedDays: number = 0,
  desiredRetention: number = 0.9,
  now: Date = new Date(),
): FSRSResult {
  if (grade < 1 || grade > 4) {
    throw new Error("Grade must be between 1 and 4.");
  }

  const {
    stability: currentS,
    difficulty: currentD,
    reps,
    lapses,
  } = currentState;

  let newS: number;
  let newD: number;
  let newLapses = lapses;

  if (reps === 0 || currentS === 0) {
    newS = s0(grade);
    newD = d0(grade);
    if (grade === 1) {
      newLapses += 1;
    }
  } else {
    const r = retrievability(elapsedDays, currentS);
    newD = difficulty(currentD, grade);
    newS = stability(newD, currentS, r, grade);
    if (grade === 1) {
      newLapses += 1;
    }
  }

  const newInterval = Math.max(1, Math.round(interval(desiredRetention, newS)));

  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    interval: newInterval,
    nextReviewDate,

    stability: Math.round(newS * 100) / 100,
    difficulty: Math.round(newD * 100) / 100,

    reps: reps + 1,
    lapses: newLapses,
  };
}
