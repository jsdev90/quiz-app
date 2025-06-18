"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const nanoid_1 = require("nanoid");
const Quiz_1 = require("./models/Quiz");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
}));
// ✅ MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/topicquizdb';
mongoose_1.default
    .connect(mongoUri)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));
// AI microservice URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://ai-service:5000/generate-quiz';
// 🧠 Call AI service to generate questions
function generateQuizFromAI(topic) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const response = yield axios_1.default.post(AI_SERVICE_URL, { topic }, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 50000,
            });
            if ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.questions) === null || _b === void 0 ? void 0 : _b.length) {
                return response.data.questions;
            }
            throw new Error('Invalid response from AI service');
        }
        catch (error) {
            console.error('❌ Error calling AI Service:', error.message);
            throw new Error('Failed to generate quiz from AI service');
        }
    });
}
// 🧾 Generate quiz endpoint
app.get('/generate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = req.query.topic;
    if (!topic) {
        return res.status(400).json({ error: 'Missing topic parameter' });
    }
    try {
        const questions = yield generateQuizFromAI(topic);
        const quizId = (0, nanoid_1.nanoid)(8);
        const quiz = new Quiz_1.Quiz({ quizId, topic, questions });
        yield quiz.save();
        const questionsNoAnswers = questions.map(({ id, text, options }) => ({
            id,
            text,
            options,
        }));
        res.json({ quizId, questions: questionsNoAnswers });
    }
    catch (err) {
        console.error('❌ Error in /generate:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// 📝 Grade quiz endpoint
app.post('/grade', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quizId = req.query.quizId;
    const userAnswers = req.body.answers;
    if (!quizId) {
        return res.status(400).json({ error: 'Missing quizId parameter' });
    }
    if (!userAnswers || typeof userAnswers !== 'object') {
        return res.status(400).json({ error: 'Missing or invalid answers in request body' });
    }
    try {
        const quiz = yield Quiz_1.Quiz.findOne({ quizId });
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        let correctCount = 0;
        const feedback = quiz.questions.map((q) => {
            const yourAnswer = userAnswers[q.id];
            const isCorrect = yourAnswer === q.correctAnswer;
            if (isCorrect)
                correctCount++;
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
    }
    catch (err) {
        console.error('❌ Error in /grade:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// 🚀 Start backend
app.listen(port, () => {
    console.log(`🚀 Backend API running at http://localhost:${port}`);
});
