#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const TOKEN = process.env.SUPABASE_ACCESS_TOKEN
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'pozlwuuakouzaiumamzy'

if (!TOKEN) {
  console.error('Missing SUPABASE_ACCESS_TOKEN env var')
  process.exit(1)
}

const API = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`
const migDir = resolve('./supabase/migrations')
const files = readdirSync(migDir)
  .filter((f) => f.endsWith('.sql'))
  .sort()

console.log(`Running ${files.length} migrations against ${PROJECT_REF}\n`)

for (const file of files) {
  const sql = readFileSync(resolve(migDir, file), 'utf8')
  process.stdout.write(`[${file}] (${sql.length} chars) ... `)
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })
  const text = await res.text()
  if (!res.ok) {
    console.error(`FAIL ${res.status}`)
    console.error(text.slice(0, 2000))
    process.exit(1)
  }
  console.log('OK')
}

console.log('\nAll migrations applied.')
