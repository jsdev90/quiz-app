import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface IQuiz extends Document {
  quizId: string;
  topic: string;
  questions: IQuestion[];
}

const QuestionSchema = new Schema<IQuestion>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
});

const QuizSchema = new Schema<IQuiz>({
  quizId: { type: String, required: true, unique: true },
  topic: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true },
});

export const Quiz: Model<IQuiz> = mongoose.model<IQuiz>('Quiz', QuizSchema);
