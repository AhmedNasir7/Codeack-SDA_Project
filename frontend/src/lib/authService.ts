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

    // Store user data in localStorage
    if (result.user) {
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('userId', result.user.id)
    }

    return result
  },

  logout(): void {
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
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

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('userId')
  },
}
