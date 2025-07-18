// hooks/useQuiz.ts
import { useEffect, useState } from "react";
import { GradeResult, Quiz, Status } from "../types";
import { QUIZ_API_URL } from "../constants";
import confetti from "canvas-confetti";

export function useQuiz() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<GradeResult | null>(null);
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [error, setError] = useState<string | null>(null);
  const [bounce, setBounce] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const simulateResponse = async (message: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${QUIZ_API_URL}/generate?topic=${encodeURIComponent(message)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const data: Quiz = await response.json();
      setQuiz(data);
      setLoading(false);
    } catch (err: any) {
      console.log(err.message || "Failed to generate quiz");
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (quiz?.questions.some((q) => !answers[q.id])) {
      setError("Please answer all questions.");
      return;
    }

    setStatus(Status.Loading);
    setError(null);

    try {
      const response = await fetch(
        `${QUIZ_API_URL}/grade?quizId=${quiz?.quizId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        }
      );

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data: GradeResult = await response.json();
      setResult(data);
      setStatus(Status.Success);
      setOpen(true);
    } catch (err: any) {
      setError(err.message || "Failed to grade quiz");
      setStatus(Status.Idle);
    }
  };

  const handleSave = async () => {
    if (status === Status.Idle) {
      await handleSubmit();
    }
  };

  const handleReset = () => {
    setQuiz(null);
    setOpen(false);
    setAnswers({});
    setResult(null);
    setStatus(Status.Idle);
  }

  useEffect(() => {
    if (status === Status.Success) {
      setBounce(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [
          "#ff0000",
          "#00ff00",
          "#0000ff",
          "#ffff00",
          "#00ffff",
          "#ff00ff",
        ],
        shapes: ["star", "circle"],
      });
      setTimeout(() => setBounce(false), 2000);
    }
  }, [status]);

  return {
    quiz,
    topic,
    answers,
    result,
    status,
    error,
    bounce,
    loading,
    open,
    setLoading,
    setTopic,
    setAnswers,
    simulateResponse,
    handleSave,
    setOpen,
    handleReset
  };
}
