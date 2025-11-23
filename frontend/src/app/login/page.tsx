'use client'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="min-h-screen grid md:grid-cols-2">
      {/* Left: Form */}
      <section className="flex items-center justify-center p-8 md:p-12 bg-white text-zinc-900">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-sm text-zinc-600 mb-8">
            Enter your credentials to access your account
          </p>

          <form
            className="space-y-4"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault()
            }}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
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
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-zinc-300"
              />
              <label htmlFor="remember" className="text-sm text-zinc-600">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-zinc-900 text-white py-3 text-sm font-semibold hover:bg-zinc-800 transition-colors"
            >
              Login
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
