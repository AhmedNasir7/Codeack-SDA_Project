'use client'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="min-h-screen grid md:grid-cols-2 bg-zinc-50 dark:bg-black">
      {/* Left: Form */}
      <section className="flex items-center justify-center p-8 md:p-12 bg-white text-zinc-900">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Welcome back!
          </h1>
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
                className="block text-xs font-medium text-zinc-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
              />
            </div>

            <div className="flex items-end justify-between">
              <div className="flex-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-zinc-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
              </div>
            </div>

            <div className="flex items-end justify-end">
              <a
                href="#"
                className="text-xs text-zinc-500 hover:text-zinc-700 ml-2 whitespace-nowrap"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-zinc-900 text-white py-2 text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-xs text-zinc-600">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="underline text-blue-600 hover:text-zinc-900"
            >
              Sign up
            </Link>
          </p>
        </div>
      </section>

      {/* Right: Brand panel */}
      <aside className="hidden md:flex items-center justify-center bg-[#071324] text-white p-8">
        <div className="w-full max-w-2xl">
          <div
            className="mx-auto flex h-64 md:h-80 items-center justify-center rounded-3xl"
            style={{
              background:
                'radial-gradient(80% 120% at 50% 20%, rgba(77,97,255,.25) 0%, transparent 60%), linear-gradient(150deg, rgba(255,255,255,.06) 0%, rgba(255,255,255,.02) 60%)',
              boxShadow:
                'inset 0 0 0 1px rgba(255,255,255,.08), 0 10px 30px rgba(0,0,0,.35)',
            }}
          >
            {/* Simple inline logo */}
            <div className="flex items-center gap-4">
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="4"
                  y="4"
                  width="48"
                  height="48"
                  rx="12"
                  fill="#0F1C36"
                />
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
              <div className="leading-tight">
                <div className="text-3xl font-semibold tracking-tight">
                  Codeack
                </div>
                <div className="text-xs text-zinc-300 tracking-wide">
                  Collaborative Coding Challenge
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>
  )
}
