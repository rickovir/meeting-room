#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up MeetSpace...')

// Check if .env.local exists and has required variables
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const hasUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=')
  const hasKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=')

  if (!hasUrl || !hasKey) {
    console.log('❌ Missing Supabase configuration in .env.local')
    console.log('Please add your Supabase URL and anon key to .env.local:')
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
    process.exit(1)
  }
  console.log('✅ Environment variables configured')
} else {
  console.log('❌ .env.local file not found')
  console.log('Please create .env.local with your Supabase configuration')
  process.exit(1)
}

// Check if database schema needs to be applied
console.log('📊 Database Setup Required:')
console.log('1. Go to your Supabase project dashboard')
console.log('2. Navigate to SQL Editor')
console.log('3. Run the contents of database/schema.sql')
console.log('4. This will create tables and sample data')

console.log('\n🎉 Setup complete! Run "npm run dev" to start the application')