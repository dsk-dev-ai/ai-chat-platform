# Contributing

Thanks for your interest in contributing to the AI Chat Platform.

## Setup

```bash
git clone https://github.com/dsk-dev-ai/ai-chat-platform.git
cd ai-chat-platform

# Backend (Flask)
cd ai-chat-backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt

# Frontend (React + Vite)
cd ../ai-chat-frontend
npm ci
```

## Quality gates

```bash
# Backend
cd ai-chat-backend && pytest -v

# Frontend
cd ai-chat-frontend && npm run build
```

Both jobs run automatically in CI on every push/PR.

## Process

1. Branch from `main`: `feat/my-feature` or `fix/my-bug`.
2. Add tests for new behavior (backend: pytest; frontend: build + typecheck).
3. Run the quality gates above.
4. Commit with a Conventional Commit message and open a PR.

## PR checklist

- [ ] Backend `pytest` passes
- [ ] Frontend `npm run build` passes
- [ ] Tests added/updated
- [ ] README updated if behavior changed