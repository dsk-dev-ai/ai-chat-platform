# Security

## Reporting a vulnerability

If you find a security issue, please do **not** open a public issue. Report it
via a [private security advisory](https://github.com/dsk-dev-ai/ai-chat-platform/security/advisories)
on GitHub. We aim to acknowledge reports within 3 business days.

## Current posture

- Authentication: JWT-based; secrets come from environment variables.
- Passwords/API keys are never logged or committed.
- Rate limiting is applied to chat endpoints (see backend config).
- The backend defaults to a local Ollama model; no third-party API keys are
  required unless configured.

Keep secrets out of code and out of the repo even in examples.