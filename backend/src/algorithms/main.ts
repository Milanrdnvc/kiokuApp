import { SM2State, SM2Grade, calculateSM2 } from "./sm2.js";
import { FSRSState, FSRSGrade, calculateFSRS } from "./fsrs.js";

export type UnifiedReviewInput =
  | {
      algorithm: "SM2";
      grade: SM2Grade;
      currentState?: SM2State;
    }
  | {
      algorithm: "FSRS";
      grade: FSRSGrade;
      currentState?: FSRSState;
      elapsedDays?: number;
    };

export type UnifiedReviewOutput =
  | {
      algorithm: "SM2";
      nextReviewDate: Date;
      interval: number;
      newState: SM2State;
    }
  | {
      algorithm: "FSRS";
      nextReviewDate: Date;
      interval: number;
      newState: FSRSState;
    };

export function reviewCard(input: UnifiedReviewInput): UnifiedReviewOutput {
  if (input.algorithm === "SM2") {
    const result = calculateSM2(input.currentState, input.grade);
    const { nextReviewDate, ...newState } = result;

    return {
      algorithm: "SM2",
      nextReviewDate,
      interval: result.interval,
      newState,
    };
  }

  const result = calculateFSRS(
    input.currentState,
    input.grade,
    input.elapsedDays ?? 0,
  );
  const { nextReviewDate, ...newState } = result;

  return {
    algorithm: "FSRS",
    nextReviewDate,
    interval: result.interval,
    newState,
  };
}
