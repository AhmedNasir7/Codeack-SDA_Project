'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/authService'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = authService.getUser()
    setUser(currentUser)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-[#0a0e27] via-[#0d1117] to-[#0a0e27] text-white">
      {/* Navigation */}
      <nav className="bg-[#000D1D] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <img
              src="/logo.png"
              alt="Codeack"
              className="w-32"
              suppressHydrationWarning
            />
          </Link>
          <button
            onClick={handleLogout}
            className="bg-black hover:bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-8 mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Welcome, {user?.username}!
            </h1>
            <p className="text-zinc-300">
              You are successfully logged in to Codeack
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                Profile Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-zinc-400">Username</p>
                  <p className="text-white font-medium">{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Email</p>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Status</p>
                  <p className="text-green-400 font-medium">
                    {user?.emailConfirmed
                      ? 'Email Verified'
                      : 'Pending Verification'}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Statistics</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-zinc-400">Challenges Completed</p>
                  <p className="text-3xl font-bold text-blue-400">0</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Ranking</p>
                  <p className="text-lg text-zinc-300">Not Ranked</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/"
                  className="block w-full bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors text-center"
                >
                  Explore Challenges
                </Link>
                <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors">
                  My Submissions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
