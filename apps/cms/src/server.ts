import 'dotenv/config'

import http from 'node:http'
import { getPayload } from 'payload'

import config from './payload.config.js'

const PORT = Number(process.env.PORT || 3000)

function sendJson(res: http.ServerResponse, status: number, body: unknown) {
  const json = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store',
  })
  res.end(json)
}

async function main() {
  const payload = await getPayload({ config })

  const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      })
      res.end()
      return
    }

    const url = new URL(req.url || '/', `http://127.0.0.1:${PORT}`)

    try {
      if (url.pathname === '/api/health') {
        sendJson(res, 200, { ok: true, service: 'marrymap-cms' })
        return
      }

      if (url.pathname === '/api/package-templates' || url.pathname === '/api/package-templates/') {
        const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || 100)))
        const result = await payload.find({
          collection: 'package-templates',
          limit,
          depth: 0,
          sort: 'names',
        })
        sendJson(res, 200, result)
        return
      }

      sendJson(res, 404, { errors: [{ message: `Route not found: ${url.pathname}` }] })
    } catch (error) {
      payload.logger.error({ err: error }, 'API request failed')
      sendJson(res, 500, {
        errors: [{ message: error instanceof Error ? error.message : 'Internal server error' }],
      })
    }
  })

  server.listen(PORT, () => {
    payload.logger.info(`Payload Local API listening on http://localhost:${PORT}`)
    payload.logger.info(`Package templates: GET /api/package-templates`)
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
