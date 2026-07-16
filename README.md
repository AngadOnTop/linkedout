# LinkedOut

A Google Translate-style parody that uses real AI to convert painfully ordinary thoughts into gloriously obnoxious LinkedIn posts.

## Setup

Install dependencies, create a local environment file, and add an OpenAI API key:

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.6-luna
```

The key is read only by the local server and is never included in the browser bundle.

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm start
```

The production server serves the built React app and the `/api/translate` endpoint together. Set `OPENAI_API_KEY` in your hosting provider's server-side environment variables.

## Checks

```bash
npm run build
npm run lint
```

Built with React, TypeScript, Vite, and the OpenAI Responses API.
