'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getAuthToken, getCurrentUser, clearAuth } from '@/lib/auth'

interface User {
  id: string
  email: string
  created_at: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      const userData = await getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearAuth()
    setUser(null)
    router.push('/login')
  }

  const requireAuth = () => {
    if (!loading && !user) {
      router.push('/login')
    }
  }

  return { user, loading, logout, refetch: checkAuth, requireAuth }
}
