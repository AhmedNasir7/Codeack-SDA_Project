'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/authService'

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const result = await authService.register({ username, email, password })
      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      {/* Left: Form */}
      <section className="flex items-center justify-center p-8 md:p-12 bg-white text-zinc-900">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-2">Get Started Now!</h1>
          <p className="text-sm text-zinc-600 mb-8">
            Create your account to join the coding challenge
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
                htmlFor="username"
                className="block text-sm font-medium text-zinc-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>

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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 mb-2"
              >
                Password
              </label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white py-3 text-sm font-semibold transition-colors"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-600 text-center">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </section>

      {/* Right: Brand panel */}
      <aside className="hidden md:flex items-center justify-center bg-linear-to-br from-[#0a0e27] via-[#0d1117] to-[#0a0e27] text-white p-8">
        <img
          src="/logo.png"
          alt="Codeack"
          className="w-96"
          suppressHydrationWarning
        />
      </aside>
    </main>
  )
}
