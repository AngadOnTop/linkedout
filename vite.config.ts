import { defineConfig, loadEnv, type Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { handleTranslateRequest } from './server/http.mjs'

function linkedOutApi(apiKey?: string, model?: string): Plugin {
  return {
    name: 'linkedout-api',
    configureServer(server) {
      server.middlewares.use('/api/translate', (request, response) => {
        void handleTranslateRequest(request, response, { apiKey, model })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      linkedOutApi(env.OPENAI_API_KEY, env.OPENAI_MODEL),
    ],
  }
})
