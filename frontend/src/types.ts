export interface Question {
  id: number;
  text: string;
  options: string[];
}

export interface Quiz {
  quizId: string;
  questions: Question[];
}

export interface FeedbackItem {
  id: number;
  yourAnswer: string;
  correctAnswer: string;
}

export interface GradeResult {
  correct: number;
  total: number;
  feedback: FeedbackItem[];
}

export enum Status {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
}
