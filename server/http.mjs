import { generateLinkedOutPost, LinkedOutError, validateTranslationInput } from './ai.mjs'

const MAX_BODY_BYTES = 8_192

function sendJson(response, status, payload) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(payload))
}

async function readJson(request) {
  const chunks = []
  let size = 0

  for await (const chunk of request) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw new LinkedOutError('That request is doing too much. Keep it concise.', 413)
    chunks.push(chunk)
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new LinkedOutError('The request body was not valid JSON.', 400)
  }
}

export async function handleTranslateRequest(request, response, options = {}) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Use POST for AI translation.' })
    return
  }

  try {
    const body = await readJson(request)
    const input = validateTranslationInput(body)
    const result = await generateLinkedOutPost(input, options)
    sendJson(response, 200, result)
  } catch (error) {
    const status = error instanceof LinkedOutError ? error.status : 500
    const message = error instanceof Error ? error.message : 'Unexpected AI error.'
    sendJson(response, status, { error: message })
  }
}
