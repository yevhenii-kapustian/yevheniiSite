// Diagnostic script — inspects raw Supabase auth.users state for given emails:
// user_id, primary email, pending new_email (mid secure-change), and linked
// identities. Used to see whether an in-progress "change email" leaves both
// old and new email able to log into the same account, or whether two
// separate user rows exist.
//
// Usage:
//   node scripts/check-auth-user.js email1@example.com email2@example.com

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

try {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^([^#=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim()
        if (!process.env[key]) process.env[key] = value
      }
    })
  }
} catch (err) {
  console.error('Could not read .env.local:', err.message)
}

const emails = process.argv.slice(2)
if (emails.length === 0) {
  console.error('Usage: node scripts/check-auth-user.js <email> [email...]')
  process.exit(1)
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function findAllUsers () {
  const all = []
  let page = 1
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    all.push(...data.users)
    if (data.users.length < 200) break
    page++
  }
  return all
}

async function run () {
  const all = await findAllUsers()

  for (const email of emails) {
    console.log(`\n=== searching for ${email} ===`)

    // Match either the primary email OR an identity's email (covers a user
    // mid secure-email-change, or logged in via an identity that doesn't
    // match auth.users.email).
    const matches = all.filter((u) =>
      u.email === email
      || (u.new_email && u.new_email === email)
      || (u.identities ?? []).some((i) => i.identity_data?.email === email)
    )

    if (matches.length === 0) {
      console.log('  No match at all.')
      continue
    }

    for (const u of matches) {
      console.log(`  user_id: ${u.id}`)
      console.log(`    email: ${u.email}`)
      console.log(`    new_email (pending change): ${u.new_email ?? '(none)'}`)
      console.log(`    email_change_sent_at: ${u.email_change_sent_at ?? '(none)'}`)
      console.log(`    email_confirmed_at: ${u.email_confirmed_at ?? '(none)'}`)
      console.log(`    created_at: ${u.created_at}`)
      console.log(`    last_sign_in_at: ${u.last_sign_in_at ?? '(none)'}`)
      console.log(`    identities: ${(u.identities ?? []).map((i) => `${i.provider}:${i.identity_data?.email}`).join(', ') || '(none)'}`)
    }
  }

  const uniqueIds = new Set(
    emails.flatMap((email) =>
      all.filter((u) => u.email === email || u.new_email === email || (u.identities ?? []).some((i) => i.identity_data?.email === email))
        .map((u) => u.id)
    )
  )
  console.log(`\nDistinct user_id(s) matched across all given emails: ${uniqueIds.size} — ${Array.from(uniqueIds).join(', ')}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
