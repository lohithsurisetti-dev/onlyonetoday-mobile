/**
 * Environment Variables
 * Type-safe access to environment variables
 */

export const env = {
  // API
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  webUrl: process.env.EXPO_PUBLIC_WEB_URL || 'http://localhost:3000',
  
  // Supabase
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  
  // Environment
  isDevelopment: process.env.EXPO_PUBLIC_ENV === 'development',
  isProduction: process.env.EXPO_PUBLIC_ENV === 'production',
} as const

// Validate required environment variables
export function validateEnv() {
  const required = {
    'EXPO_PUBLIC_SUPABASE_URL': env.supabase.url,
    'EXPO_PUBLIC_SUPABASE_ANON_KEY': env.supabase.anonKey,
  }

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables:', missing.join(', '))
    console.warn('⚠️ Copy env.example to .env and fill in the values')
  }
}

