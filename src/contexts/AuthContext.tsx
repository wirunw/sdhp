'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'sdhp_auth_timestamp'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Protected routes that require authentication
  // Only /dashboard requires auth
  // /assessments/new, /assessments/[id] are public
  const isProtectedRoute = pathname?.startsWith('/dashboard')

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      // Check localStorage first for immediate client-side verification
      if (typeof window !== 'undefined') {
        const authTimestamp = localStorage.getItem(AUTH_STORAGE_KEY)
        if (authTimestamp) {
          const timestamp = parseInt(authTimestamp, 10)
          const now = Date.now()
          // Valid for 7 days (7 * 24 * 60 * 60 * 1000 ms)
          if (now - timestamp < 7 * 24 * 60 * 60 * 1000) {
            setIsAuthenticated(true)
            setIsLoading(false)
            return true
          } else {
            // Expired, remove it
            localStorage.removeItem(AUTH_STORAGE_KEY)
          }
        }
      }

      // Fallback to server-side check
      const response = await fetch('/api/auth', { credentials: 'include' })
      const data = await response.json()

      const authenticated = data.authenticated || false
      setIsAuthenticated(authenticated)
      setIsLoading(false)

      return authenticated
    } catch (error) {
      console.error('Auth check error:', error)
      setIsAuthenticated(false)
      setIsLoading(false)
      return false
    }
  }, [])

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        // Store auth timestamp in localStorage for immediate client-side verification
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_STORAGE_KEY, Date.now().toString())
        }
        setIsAuthenticated(true)
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
      setIsAuthenticated(false)
      // Clear server-side cookie
      await fetch('/api/auth', {
        method: 'DELETE',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Check auth on mount and when pathname changes
  useEffect(() => {
    if (isProtectedRoute) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [pathname, isProtectedRoute, checkAuth])

  // Redirect to login if accessing protected route while not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && isProtectedRoute) {
      // Don't redirect if already on login page
      if (pathname !== '/login') {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      }
    }
  }, [isAuthenticated, isLoading, isProtectedRoute, pathname, router])

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
