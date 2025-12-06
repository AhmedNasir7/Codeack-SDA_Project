import { API_BASE_URL } from './apiConfig'

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  user: {
    id: string
    email: string
    username: string
    emailConfirmed: boolean
    user_id?: number
    portfolio_id?: number
  }
}

export const authService = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    const result = await response.json()

    // Store user data in localStorage
    if (result.user) {
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('userId', result.user.id)
    }

    return result
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const result = await response.json()

    // Store user data in localStorage with all available info
    if (result.user) {
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('userId', result.user.id)
      localStorage.setItem('userEmail', result.user.email)
      localStorage.setItem('username', result.user.username)
      if (result.user.user_id) {
        localStorage.setItem('dbUserId', result.user.user_id.toString())
      }
      if (result.user.portfolio_id) {
        localStorage.setItem('portfolioId', result.user.portfolio_id.toString())
      }
    }

    return result
  },

  logout(): void {
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('username')
    localStorage.removeItem('dbUserId')
    localStorage.removeItem('portfolioId')
  },

  getUser() {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  getUserId(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('userId')
  },

  getEmail(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('userEmail')
  },

  getUsername(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('username')
  },

  getDbUserId(): number | null {
    if (typeof window === 'undefined') return null
    const id = localStorage.getItem('dbUserId')
    return id ? parseInt(id) : null
  },

  getPortfolioId(): number | null {
    if (typeof window === 'undefined') return null
    const id = localStorage.getItem('portfolioId')
    return id ? parseInt(id) : null
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('userId')
  },

  /**
   * Fetch current logged-in user's full data from backend
   */
  async getCurrentUser() {
    const email = this.getEmail()
    if (!email) {
      throw new Error('User email not found in storage')
    }

    const response = await fetch(
      `${API_BASE_URL}/auth/me?email=${encodeURIComponent(email)}`,
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch user data')
    }

    return response.json()
  },

  setUser(user: any): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('user', JSON.stringify(user))
  },

  setEmail(email: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('userEmail', email)
  },

  setUsername(username: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('username', username)
  },
}
