import React from "react";
import { Quiz, GradeResult, Status } from "../types";
import { QuestionCard } from "./QuestionCard";
import { Button } from "./SubmitButton";
import { AlertTriangleIcon } from "lucide-react";

interface QuizProps {
  quiz: Quiz;
  onReset: () => void;
  answers: Record<number, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  error: string | null;
  handleSubmit: () => void;
  result: GradeResult | null;
  status: Status;
  bounce: boolean;
}

const QuizComponent: React.FC<QuizProps> = ({
  quiz,
  onReset,
  answers,
  setAnswers,
  error,
  result,
  status,
  bounce,
  handleSubmit,
}) => {
  const handleChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  if (result) {
    return (
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">
          Your Score: {result.correct} / {result.total}
        </h2>
        <ul className="space-y-2 mb-6">
          {result.feedback.map((f) => (
            <li
              key={f.id}
              className={`text-sm ${
                f.yourAnswer === f.correctAnswer
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span className="font-medium">Question {f.id}:</span> Your answer:{" "}
              <span className="italic">{f.yourAnswer}</span> — Correct answer:{" "}
              <span className="italic">{f.correctAnswer}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Try another quiz
        </button>
      </div>
    );
  }

  return (
    <div className="py-4 text-gray-100">
      <QuestionCard
        items={quiz?.questions}
        answers={answers}
        handleChange={handleChange}
      />
      {error && (
        <p className="text-yellow-600 text-lg font-medium text-center pb-3 flex items-center justify-center gap-3">
          <AlertTriangleIcon />
          {error}
        </p>
      )}
      <Button
        onClick={handleSubmit}
        text={{
          idle: "Submit",
          loading: "Submitting...",
          success: "Submitted! Woohoo!",
        }}
        status={status}
        className="w-full shadow-xl"
        bounce={bounce}
      />
    </div>
  );
};

export default QuizComponent;
