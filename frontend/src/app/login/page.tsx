'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/authService'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const result = await authService.login({ email, password })
      setSuccess('Login successful! Redirecting...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      {/* Left: Form */}
      <section className="flex items-center justify-center p-8 md:p-12 bg-white text-zinc-900">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-sm text-zinc-600 mb-8">
            Enter your credentials to access your account
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <div className="flex flex-row justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  <Link
                  href="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </Link>    
                </a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 rounded border-zinc-300"
              />
              <label htmlFor="remember" className="text-sm text-zinc-600">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white py-3 text-sm font-semibold transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-600 text-center">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </section>

      {/* Right: Brand panel */}
      <aside className="hidden md:flex items-center justify-center bg-linear-to-br from-[#0a0e27] via-[#0d1117] to-[#0a0e27] text-white p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <svg
              width="100"
              height="100"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24"
            >
              <rect x="4" y="4" width="48" height="48" rx="12" fill="#0F1C36" />
              <path
                d="M22 20l-6 8 6 8"
                stroke="#7DD3FC"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M34 20l6 8-6 8"
                stroke="#A78BFA"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="28" cy="28" r="3" fill="#60A5FA" />
            </svg>
          </div>
          <h2 className="text-5xl font-bold tracking-tight mb-2">Codeack</h2>
          <p className="text-lg text-zinc-400 tracking-wide">
            COLLABORATIVE CODING CHALLENGE
          </p>
        </div>
      </aside>
    </main>
  )
}
