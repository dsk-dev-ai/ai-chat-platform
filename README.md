# ai-chat-platform
Full stack AI Chat SaaS with React + Flask + Ollama (Local LLM)

# AI Chat Platform (Full Stack SaaS)

Full Stack AI Chat SaaS built with:

-  React + TypeScript (Frontend)
-  Flask (Backend API)
-  Ollama Local LLM
-  JWT Authentication
-  Chat History System
-  Admin & User Management

---

##  Project Structure

ai-chat-platform/
│
├── ai-chat-backend/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── schemas/
│   ├── db/
│   ├── app.py
│   ├── config.py
│   └── requirements.txt
│
├── ai-chat-frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
├── generate_token.py
├── response.json
└── README.md

---

🔧 Backend Setup
cd ai-chat-backend
python -m venv venv

▶ Activate Virtual Environment

Windows:

venv\Scripts\activate


Mac/Linux:

source venv/bin/activate

▶ Install Dependencies
pip install -r requirements.txt

▶ Run Server
python app.py


Backend runs on:

http://127.0.0.1:5000

💻 Frontend Setup
cd ai-chat-frontend
npm install
npm run dev


Frontend runs on:

http://localhost:3000

🔐 Authentication Features

JWT-based authentication

Token expiration handling

Middleware-protected routes

Role-based access control (Admin / User)

🧠 AI Integration

Supports:

Ollama local models

Easily extendable to OpenAI API

📊 Features

✅ Create new chats

✅ Persistent chat history per user

✅ Dark mode UI

✅ Admin routes & management

✅ Message limits

✅ Secure backend architecture

# ✅ Tests & CI

## Backend Tests

```bash
cd ai-chat-backend
pip install -r requirements.txt
pip install -r requirements-dev.txt
pytest
```

Runs the backend test suite (request validation, auth/registration flow, token
counting, rate limiting, and config defaults) against an isolated throwaway
SQLite database — no network, external services, or a live Ollama server needed.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push/PR to `main`:

- `backend-tests` — installs the backend dependencies and runs `pytest`
- `frontend-build` — installs frontend deps with `npm ci` and runs `npm run build`

📌 Version

Current Version: v3.0

🚀 Future Improvements

Docker deployment

CI/CD pipeline

Streaming AI responses

API rate limiting

Production database (PostgreSQL)

Cloud deployment support

👨‍💻 Author

DSK — AI Developer
