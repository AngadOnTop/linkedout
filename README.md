# LinkedOut

A Google Translate-style parody that uses real AI to convert painfully ordinary thoughts into gloriously obnoxious LinkedIn posts. It defaults to a free OpenRouter model and can optionally use OpenAI.

## Setup

Install dependencies, create a local environment file, and add a free OpenRouter API key:

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```env
OPENROUTER_API_KEY=your_openrouter_key_here
OPENROUTER_MODEL=google/gemma-4-31b-it:free
```

The model line is optional; Gemma 4 31B Instruct is the default, with Gemma 4 26B as an automatic fallback when the free provider is unavailable. The key is read only by the local server and is never included in the browser bundle. If `OPENROUTER_API_KEY` is absent, the server can still use the optional `OPENAI_API_KEY` configuration shown in `.env.example`.

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm start
```

The production server serves the built React app and the `/api/translate` endpoint together. Set `OPENROUTER_API_KEY` in your hosting provider's server-side environment variables.

## Checks

```bash
npm run build
npm run lint
```

Built with React, TypeScript, Vite, and an OpenAI-compatible AI backend.
