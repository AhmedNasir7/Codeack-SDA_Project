'use client'
import React from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setError(null)
    // TODO: implement actual password reset request
    console.log('New password saved')
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      {/* Left: Form */}
      <section className="flex items-center justify-center p-8 md:p-12 bg-white text-zinc-900">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Forgot Password?</h1>
          <p className="text-sm text-zinc-600 mb-6">
            Enter your new Password to access your account
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-zinc-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400"
              />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-40 rounded-full bg-zinc-900 text-white py-2 text-sm font-semibold hover:bg-zinc-800 transition-colors"
            >
              Save
            </button>
          </form>

        </div>
      </section>

      {/* Right: Brand panel */}
      <aside className="hidden md:flex items-center justify-center bg-[#071025] p-8">
        <div className="text-center">
          <img src="/logo.png" alt="Codeack" className="w-80 mx-auto" suppressHydrationWarning />
        </div>
      </aside>
    </main>
  )
}
