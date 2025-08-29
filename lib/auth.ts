'use client'

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null
  const cookies = document.cookie.split(';')
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='))
  return authCookie ? authCookie.split('=')[1].trim() : null
}

export async function getCurrentUser() {
  const token = getAuthToken()
  if (!token) return null

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}

export function clearAuth() {
  if (typeof document !== 'undefined') {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict'
  }
}

export function setAuthToken(token: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `auth_token=${token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}` // 7 days
  }
}
