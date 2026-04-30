#!/usr/bin/env node
/**
 * Creates (or updates) the first admin user with role: 'admin' in user_metadata.
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ADMIN_SEED_EMAIL
 *   ADMIN_SEED_PASSWORD     (min 8 chars)
 *
 * Usage:
 *   ADMIN_SEED_EMAIL=david@daklnetworking.cz \
 *   ADMIN_SEED_PASSWORD='choose-a-good-pw' \
 *   node scripts/create-admin-user.mjs
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
const email = process.env.ADMIN_SEED_EMAIL
const password = process.env.ADMIN_SEED_PASSWORD

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
if (!email || !password) {
  console.error('Missing ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD')
  process.exit(1)
}
if (password.length < 8) {
  console.error('ADMIN_SEED_PASSWORD must be at least 8 characters')
  process.exit(1)
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

const { data: existingList } = await supabase.auth.admin.listUsers()
const existing = existingList?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())

if (existing) {
  const { error } = await supabase.auth.admin.updateUserById(existing.id, {
    password,
    user_metadata: { ...existing.user_metadata, role: 'admin' },
    email_confirm: true,
  })
  if (error) {
    console.error('Update failed:', error.message)
    process.exit(1)
  }
  console.log(`✓ Updated existing user ${email} → role=admin, password reset`)
} else {
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { role: 'admin' },
    email_confirm: true,
  })
  if (error) {
    console.error('Create failed:', error.message)
    process.exit(1)
  }
  console.log(`✓ Created admin user ${email}`)
}

console.log(`\nLogin via /admin/login (use the bullet "·" in the footer copyright row).`)
