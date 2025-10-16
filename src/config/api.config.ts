/**
 * API Configuration
 * Environment-aware API endpoints
 */

const ENV = process.env.EXPO_PUBLIC_ENV || 'development'

const config = {
  development: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
    webUrl: process.env.EXPO_PUBLIC_WEB_URL || 'http://localhost:3000',
    timeout: 10000,
  },
  production: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://onlyonetoday.com/api',
    webUrl: process.env.EXPO_PUBLIC_WEB_URL || 'https://onlyonetoday.com',
    timeout: 15000,
  },
}

export const apiConfig = config[ENV as keyof typeof config] || config.development

export const endpoints = {
  // Posts
  posts: {
    create: '/posts',
    list: '/posts',
    detail: (id: string) => `/posts/${id}`,
    react: '/reactions',
  },
  
  // Stats
  stats: {
    today: '/stats',
    rankings: '/stats/rankings',
    timezones: '/stats/timezones',
  },
  
  // Auth (to be implemented)
  auth: {
    login: '/auth/login',
    verify: '/auth/verify',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  
  // Feed
  feed: {
    list: '/feed',
  },
} as const

