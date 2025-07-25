import { Title } from "./components/Title";
import QuizComponent from "./components/Quiz";
import { GlowCard } from "./components/SpotlightCard";
import { AIInputWithLoading } from "./components/AIInputWithLoading";
import { useQuiz } from "./hooks/useQuiz";
import useKeepAlive from "./hooks/useKeepAlive";

function App() {
  const {
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
    simulateResponse,
    handleSave,
    setAnswers,
    setOpen,
    handleReset
  } = useQuiz();

  useKeepAlive();

  return (
    <div className="min-h-screen bg-gray-800 py-10">
      <div className="max-w-xl mx-auto mt-8 px-4">
        <Title title="Topic Quiz Creator" />
        <GlowCard height={150}>
          <AIInputWithLoading
            onSubmit={simulateResponse}
            placeholder="Type a topic..."
            onChange={(value) => setTopic(value)}
            value={topic}
            loading={loading}
            setLoading={setLoading}
            error={error}
          />
        </GlowCard>
        {quiz?.quizId && (
          <QuizComponent
            quiz={quiz}
            onReset={handleReset}
            answers={answers}
            setAnswers={setAnswers}
            error={error}
            handleSubmit={handleSave}
            result={result}
            status={status}
            bounce={bounce}
            open={open}
            setOpen={setOpen}
          />
        )}
      </div>
    </div>
  );
}

export default App;
