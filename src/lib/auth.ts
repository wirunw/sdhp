// Client-side auth utilities

const AUTH_STORAGE_KEY = 'sdhp_auth_timestamp'

export async function checkAuth(): Promise<boolean> {
  try {
    // Check localStorage first for immediate client-side verification
    if (typeof window !== 'undefined') {
      const authTimestamp = localStorage.getItem(AUTH_STORAGE_KEY)
      if (authTimestamp) {
        const timestamp = parseInt(authTimestamp, 10)
        const now = Date.now()
        // Valid for 7 days (7 * 24 * 60 * 60 * 1000 ms)
        if (now - timestamp < 7 * 24 * 60 * 60 * 1000) {
          return true
        } else {
          // Expired, remove it
          localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      }
    }

    // Fallback to server-side check
    const response = await fetch('/api/auth')
    const data = await response.json()
    return data.authenticated || false
  } catch (error) {
    return false
  }
}

export async function login(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (response.ok) {
      // Store auth timestamp in localStorage for immediate client-side verification
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, Date.now().toString())
      }
      return { success: true }
    } else {
      const data = await response.json()
      return { success: false, error: data.error || 'Login failed' }
    }
  } catch (error) {
    return { success: false, error: 'Network error' }
  }
}

export async function logout(): Promise<void> {
  try {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
    // Clear server-side cookie
    await fetch('/api/auth', { method: 'DELETE' })
  } catch (error) {
    console.error('Logout error:', error)
  }
}
