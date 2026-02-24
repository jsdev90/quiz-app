# Quiz App Monorepo

A full-stack, AI-powered quiz application with a modern React frontend, a Node.js/Express backend, and a Python-based AI service.  
All services are containerized and orchestrated with Docker Compose.

## Live URLs
- **Frontend:** [https://quiz-app-five-orpin.vercel.app/](https://quiz-app-five-orpin.vercel.app)
- **Backend:** [https://quiz-app-backend-y3rr.onrender.com](https://quiz-app-backend-y3rr.onrender.com)
- **AI Service:** [https://quiz-app-ai-service.onrender.com](https://quiz-app-ai-service.onrender.com)

---

## Project Structure

```
quiz-app/
│
├── frontend/      # React + TypeScript client (Tailwind CSS, Framer Motion, etc.)
├── backend/       # Node.js/Express API server (TypeScript, MongoDB)
├── ai-service/    # Python FastAPI AI microservice
├── docker-compose.yml
```

---

## Features

- **Frontend**
  - Built with React and TypeScript
  - Modern UI with Tailwind CSS and Framer Motion
  - Confetti and animated effects
  - Connects to backend for quiz data and scoring

- **Backend**
  - Node.js + Express + TypeScript
  - MongoDB for data storage
  - REST API for quiz management and results
  - Communicates with the AI service for question generation and evaluation

- **AI Service**
  - Python FastAPI microservice
  - Uses MISTRAL API (requires `MISTRAL_API_KEY`)
  - Generates quiz questions

- **DevOps**
  - Dockerized services for easy setup
  - MongoDB database with Mongo Express admin UI
  - Environment variable support

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- (For local dev) Node.js (v18+) and Python 3.10+ if running services outside Docker

---

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/quiz-app.git
cd quiz-app
```

---

### 2. Environment Variables

- Create a `.env` file in the root directory with your HuggingFace API token:
  ```
  HF_API_TOKEN=your_huggingface_api_token
  ```

---

### 3. Start All Services with Docker Compose

```sh
docker-compose up --build
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:4000](http://localhost:4000)
- **AI Service:** [http://localhost:5000](http://localhost:5000)
- **Mongo Express:** [http://localhost:8081](http://localhost:8081) (user: `admin`, pass: `admin123`)

---

### 4. Development (Optional: Run Services Individually)

#### Frontend

```sh
cd frontend
npm install
npm start
```

#### Backend && AI Service
```sh
docker-compose up
```

#### Backend

```sh
cd backend
npm install
npm run dev
```

#### AI Service

```sh
cd ai-service
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 5000
```

---

## Scripts

### Frontend

- `npm start` — Start React dev server
- `npm run build` — Build for production
- `npm test` — Run tests

### Backend

- `npm run dev` — Start in dev mode (TypeScript)
- `npm run build` — Compile TypeScript
- `npm start` — Run compiled server

### AI Service

- `uvicorn main:app --host 0.0.0.0 --port 5000` — Start FastAPI server

---

## Project Structure Details

```
frontend/
  ├── src/
  │   ├── components/
  │   ├── pages/
  │   ├── hooks/
  │   ├── utils/
  │   ├── App.tsx
  │   └── index.tsx
  └── package.json

backend/
  ├── src/
  │   ├── index.ts
  │   └── ...other files
  ├── package.json
  └── tsconfig.json

ai-service/
  ├── app/
  │   ├── main.py
  │   └── ...other files
  ├── requirements.txt
  └── Dockerfile
```

---

## Local URLs

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:4000](http://localhost:4000)
- **AI Service:** [http://localhost:5000](http://localhost:5000)
- **Mongo Express:** [http://localhost:8081](http://localhost:8081)

---

---

## Superfluous API requests

To prevent the backend and AI service (both hosted on Render's free tier) from sleeping due to inactivity, I send periodic HTTP requests ("pings") to keep them awake.

---

## License

MIT

---

Made with ❤️ by JS.
