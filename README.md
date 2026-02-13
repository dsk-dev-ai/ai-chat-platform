# ai-chat-platform
Full stack AI Chat SaaS with React + Flask + Ollama (Local LLM)

# 🚀 AI Chat Platform (Full Stack SaaS)

Full Stack AI Chat SaaS built with:

- ⚛ React + TypeScript (Frontend)
- 🐍 Flask (Backend API)
- 🧠 Ollama Local LLM
- 🔐 JWT Authentication
- 💬 Chat History System
- 🗂 Admin & User Management

---

## 📦 Project Structure

ai-chat-platform/
│
├── ai-chat-backend/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── utils/
│ ├── schemas/
│ ├── db/
│ ├── app.py
│ ├── config.py
│ └── requirements.txt
│
├── ai-chat-frontend/
│ ├── src/
│ ├── package.json
│ └── vite.config.ts
│
└── README.md


---

## 🔧 Backend Setup

```bash
cd ai-chat-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
Runs on:

http://127.0.0.1:5000
💻 Frontend Setup
cd ai-chat-frontend
npm install
npm run dev
Runs on:

http://localhost:3000
🔐 Authentication
JWT based login

Token expiration

Middleware protected routes

Role-based access (Admin/User)

🧠 AI Integration
Supports:

Ollama local models

Extendable to OpenAI API

📊 Features
Create new chats

Chat history per user

Dark mode

Admin routes

Message limits

Secure backend structure

📌 Version
Current Version: v3.0

🚀 Future Improvements
Docker deployment

CI/CD pipeline

Streaming responses

Rate limiting

Production database (PostgreSQL)

👨‍💻 Author
DSK - AI Developer
