import {
  generateLinkedOutPost,
  LinkedOutError,
  validateTranslationInput,
} from '../../server/ai.mjs'

const JSON_HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS,
  })
}

export default async function translate(request) {
  if (request.method !== 'POST') {
    return json({ error: 'Use POST for AI translation.' }, 405)
  }

  try {
    let body

    try {
      body = await request.json()
    } catch {
      throw new LinkedOutError('The request body was not valid JSON.', 400)
    }

    const input = validateTranslationInput(body)
    const result = await generateLinkedOutPost(input)
    return json(result)
  } catch (error) {
    const status = error instanceof LinkedOutError ? error.status : 500
    const message = error instanceof Error ? error.message : 'Unexpected AI error.'
    return json({ error: message }, status)
  }
}
