import React from "react";
import { Quiz, GradeResult, Status } from "../types";
import { QuestionCard } from "./QuestionCard";
import { Button } from "./SubmitButton";
import { AlertTriangleIcon } from "lucide-react";
import { ModalBody, ModalFooter } from "./Modal";

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
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  open,
  setOpen,
}) => {
  const handleChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  if (result) {
    return (
      <ModalBody open={open} setOpen={setOpen}>
        <h4 className="text-2xl text-gray-100 dark:text-neutral-100 font-bold text-center m-4">
          Your Score:{" "}
          <span className="px-1 py-0.5 rounded-md bg-red-400">
            {result.correct} / {result.total}
          </span>
        </h4>
        <div className="p-5">
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
                <span className="font-medium">Question {f.id}:</span>
                <p>Your answer:{" "}<span className="italic">{f.yourAnswer}</span></p>
                <p>Correct answer:{" "}<span className="italic">{f.correctAnswer}</span></p>                
              </li>
            ))}
          </ul>
        </div>
        <ModalFooter className="gap-4">
          <button className="p-2 rounded-md bg-green-400 text-white" onClick={onReset}>
            Try Another Quiz
          </button>
        </ModalFooter>
      </ModalBody>
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
