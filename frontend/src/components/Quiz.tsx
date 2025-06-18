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
    // return (
    //   <div className="p-6 bg-white rounded shadow">
    //     <h2 className="text-xl font-bold mb-4">
    //       Your Score: {result.correct} / {result.total}
    //     </h2>
    //     <ul className="space-y-2 mb-6">
    //       {result.feedback.map((f) => (
    //         <li
    //           key={f.id}
    //           className={`text-sm ${
    //             f.yourAnswer === f.correctAnswer
    //               ? "text-green-600"
    //               : "text-red-600"
    //           }`}
    //         >
    //           <span className="font-medium">Question {f.id}:</span> Your answer:{" "}
    //           <span className="italic">{f.yourAnswer}</span> — Correct answer:{" "}
    //           <span className="italic">{f.correctAnswer}</span>
    //         </li>
    //       ))}
    //     </ul>
    //     <button
    //       onClick={onReset}
    //       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    //     >
    //       Try another quiz
    //     </button>
    //   </div>
    // );
    return (
      <ModalBody open={open} setOpen={setOpen}>
        <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
          Your Score:{" "}
          <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
            {result.correct} / {result.total}
          </span>
        </h4>
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
        <ModalFooter className="gap-4">
          <button className="w-28 bg-black text-white dark:bg-white dark:text-black border border-black">
            Try another quiz
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
