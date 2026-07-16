import 'dotenv/config'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleTranslateRequest } from './http.mjs'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const dist = resolve(root, 'dist')
const port = Number(process.env.PORT || 4173)

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

async function serveApp(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405).end()
    return
  }

  const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname)
  const requested = resolve(dist, `.${pathname}`)
  let file = requested.startsWith(dist) ? requested : resolve(dist, 'index.html')

  try {
    const info = await stat(file)
    if (info.isDirectory()) file = resolve(file, 'index.html')
  } catch {
    file = resolve(dist, 'index.html')
  }

  response.statusCode = 200
  response.setHeader('Content-Type', contentTypes[extname(file)] || 'application/octet-stream')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  if (request.method === 'HEAD') response.end()
  else createReadStream(file).pipe(response)
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname
  if (pathname === '/api/translate') await handleTranslateRequest(request, response)
  else await serveApp(request, response)
})

server.listen(port, () => {
  console.log(`LinkedOut is running at http://localhost:${port}`)
})
