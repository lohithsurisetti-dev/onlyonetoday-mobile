/**
 * API Client
 * Axios instance with interceptors for auth, error handling, and logging
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { apiConfig } from '@config/api.config'

// Create axios instance
export const apiClient = axios.create({
  baseURL: apiConfig.apiUrl,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor
 * Add auth token, logging, etc.
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    // const token = await getAuthToken()
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    // Log request in development
    if (__DEV__) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      })
    }

    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Handle errors globally, refresh tokens, etc.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      })
    }

    return response.data
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      console.error('❌ Response Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      })
    }

    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - token expired
      // Trigger logout or token refresh
      console.warn('🔒 Unauthorized - Token expired')
      // authStore.getState().logout()
    }

    if (error.response?.status === 429) {
      // Rate limit exceeded
      console.warn('⏱️ Rate limit exceeded')
    }

    // Return structured error
    return Promise.reject({
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    })
  }
)

/**
 * Type-safe API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}

/**
 * API Error type
 */
export interface ApiError {
  status?: number
  message: string
  data?: unknown
}

