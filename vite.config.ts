import { defineConfig, loadEnv, type Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { handleTranslateRequest, type TranslateServerOptions } from './server/http.mjs'

function linkedOutApi(options: TranslateServerOptions): Plugin {
  return {
    name: 'linkedout-api',
    configureServer(server) {
      server.middlewares.use('/api/translate', (request, response) => {
        void handleTranslateRequest(request, response, options)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const usesOpenRouter = Boolean(env.OPENROUTER_API_KEY)

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      linkedOutApi({
        apiKey: usesOpenRouter ? env.OPENROUTER_API_KEY : env.OPENAI_API_KEY,
        model: usesOpenRouter ? env.OPENROUTER_MODEL : env.OPENAI_MODEL,
        provider: usesOpenRouter ? 'openrouter' : 'openai',
      }),
    ],
  }
})
