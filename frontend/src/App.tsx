import { Title } from "./components/Title";
import QuizComponent from "./components/Quiz";
import { GlowCard } from "./components/SpotlightCard";
import { AIInputWithLoading } from "./components/AIInputWithLoading";
import { useQuiz } from "./hooks/useQuiz";

function App() {
  const {
    quiz,
    topic,
    answers,
    result,
    status,
    error,
    bounce,
    setTopic,
    simulateResponse,
    handleSave,
    setQuiz,
    setAnswers,
  } = useQuiz();

  return (
    <div className="min-h-screen bg-gray-800 py-10">
      <div className="max-w-xl mx-auto mt-8 px-4">
        <Title title="Topic Quiz Creator" />
        <GlowCard height={150}>
          <AIInputWithLoading
            onSubmit={simulateResponse}
            loadingDuration={3000}
            placeholder="Type a topic..."
            onChange={(value) => setTopic(value)}
            value={topic}
          />
        </GlowCard>
        {quiz && (
          <QuizComponent
            quiz={quiz}
            onReset={() => setQuiz(null)}
            answers={answers}
            setAnswers={setAnswers}
            error={error}
            handleSubmit={handleSave}
            result={result}
            status={status}
            bounce={bounce}
          />
        )}
      </div>
    </div>
  );
}

export default App;
