import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import cors from 'cors';
import { nanoid } from 'nanoid';
import { Quiz, IQuiz, IQuestion } from './models/Quiz';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}));

// ✅ MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/topicquizdb';
mongoose
  .connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// AI microservice URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://quiz-app-ai-service.onrender.com';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface AIResponse {
  questions: Question[];
}

// 🧠 Call AI service to generate questions
async function generateQuizFromAI(topic: string): Promise<Question[]> {
  try {
    const response = await axios.post<AIResponse>(
      `${AI_SERVICE_URL}/generate-quiz`,
      { topic },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 50000,
      }
    );

    if (response.data?.questions?.length) {
      return response.data.questions;
    }

    throw new Error('Invalid response from AI service');
  } catch (error: any) {
    console.error('❌ Error calling AI Service:', error.message);
    throw new Error('Failed to generate quiz from AI service');
  }
}

// 🧾 Generate quiz endpoint
app.get('/generate', async (req: Request, res: Response) => {
  const topic = req.query.topic as string;
  if (!topic) {
    return res.status(400).json({ error: 'Missing topic parameter' });
  }

  try {
    const questions = await generateQuizFromAI(topic);
    const quizId = nanoid(8);
    const quiz: IQuiz = new Quiz({ quizId, topic, questions });

    await quiz.save();

    const questionsNoAnswers = questions.map(({ id, text, options }) => ({
      id,
      text,
      options,
    }));

    res.json({ quizId, questions: questionsNoAnswers });
  } catch (err) {
    console.error('❌ Error in /generate:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 📝 Grade quiz endpoint
app.post('/grade', async (req: Request, res: Response) => {
  const quizId = req.query.quizId as string;
  const userAnswers: Record<string, string> = req.body.answers;

  if (!quizId) {
    return res.status(400).json({ error: 'Missing quizId parameter' });
  }

  if (!userAnswers || typeof userAnswers !== 'object') {
    return res.status(400).json({ error: 'Missing or invalid answers in request body' });
  }

  try {
    const quiz = await Quiz.findOne({ quizId });
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let correctCount = 0;
    const feedback = quiz.questions.map((q: IQuestion) => {
      const yourAnswer = userAnswers[q.id];
      const isCorrect = yourAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        id: q.id,
        yourAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    res.json({
      correct: correctCount,
      total: quiz.questions.length,
      feedback,
    });
  } catch (err) {
    console.error('❌ Error in /grade:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🚀 Start backend
app.listen(port, () => {
  console.log(`🚀 Backend API running at http://localhost:${port}`);
});
