'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/authService'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = authService.getUser()
    setUser(currentUser)
    setLoading(false)
  }, [router])

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
      <Navbar />

      {/* Main Content */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl font-bold mb-12">Profile</h1>

          <div className="grid grid-cols-12 gap-6 h-96">
            {/* Left Sidebar - User Info */}
            <div className="col-span-3">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 text-center h-full">
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  <div className="w-28 h-28 bg-red-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>

                {/* Name */}
                <h2 className="text-2xl font-bold mb-6">
                  {user?.username || 'Name'}
                </h2>

                {/* Edit Profile Button */}
                <button
                  onClick={() => {
                    setFormData({
                      username: user?.username || '',
                      email: user?.email || '',
                      password: '',
                    })
                    setIsModalOpen(true)
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors inline-flex items-center justify-center gap-2 mb-8"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Center - Problems Solved */}
            <div className="col-span-4">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 h-full">
                <h2 className="text-xl font-bold mb-8">Problems Solved</h2>

                {/* Donut Chart */}
                <div className="flex flex-col items-center gap-8">
                  <div className="relative w-48 h-48">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      {/* Easy - 40% - Green */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="8"
                        strokeDasharray="100.48 251.2"
                      />
                      {/* Mid - 28% - Orange */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="8"
                        strokeDasharray="70.336 251.2"
                        strokeDashoffset="-100.48"
                      />
                      {/* Hard - 32% - Red */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="8"
                        strokeDasharray="80.384 251.2"
                        strokeDashoffset="-170.816"
                      />
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="w-full space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        <span className="text-zinc-300">Easy</span>
                      </div>
                      <span className="font-bold text-green-400">40%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                        <span className="text-zinc-300">Mid</span>
                      </div>
                      <span className="font-bold text-amber-400">28%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        <span className="text-zinc-300">Hard</span>
                      </div>
                      <span className="font-bold text-red-400">32%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Badges */}
            <div className="col-span-5">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 h-full">
                <h2 className="text-xl font-bold mb-8">Badges</h2>

                <div className="grid grid-cols-2 gap-6">
                  {/* Badge 1 - Star */}
                  <div className="flex flex-col items-center gap-3 p-6 border border-zinc-700 rounded-3xl bg-blue-950/30">
                    <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-zinc-300">100 Streak</span>
                  </div>

                  {/* Badge 2 - First Solve */}
                  <div className="flex flex-col items-center gap-3 p-6 border border-zinc-700 rounded-3xl bg-blue-950/30">
                    <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-zinc-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-zinc-300">First Solve</span>
                  </div>

                  {/* Badge 3 - Speed Demon */}
                  <div className="flex flex-col items-center gap-3 p-6 border border-zinc-700 rounded-3xl bg-blue-950/30">
                    <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-orange-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="text-sm text-zinc-300">Speed Demon</span>
                  </div>

                  {/* Badge 4 - Locked */}
                  <div className="flex flex-col items-center gap-3 p-6 border border-zinc-700 rounded-3xl bg-blue-950/30">
                    <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-zinc-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                      </svg>
                    </div>
                    <span className="text-sm text-zinc-300">Locked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Community Stats & Activity */}
          <div className="grid grid-cols-3 gap-6 mt-24">
            {/* Left - Community Stats */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Community Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Views</span>
                  <span className="text-white font-bold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Discuss</span>
                  <span className="text-white font-bold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Reputation</span>
                  <span className="text-white font-bold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Solutions</span>
                  <span className="text-white font-bold">0</span>
                </div>
              </div>
            </div>

            {/* Right - Activity Graph */}
            <div className="col-span-2 bg-zinc-900/50 border border-blue-900/50 rounded-lg p-6">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-300 mb-1">
                      Submissions in past year: 44
                    </h3>
                  </div>
                  <div className="space-y-1 text-right text-sm text-zinc-400">
                    <div>
                      Total active days:{' '}
                      <span className="text-white font-bold">20</span>
                    </div>
                    <div>
                      Max Streak:{' '}
                      <span className="text-white font-bold">0</span>
                    </div>
                  </div>
                </div>

                {/* Activity Graph */}
                <div className="flex justify-center">
                  <div
                    className="inline-grid gap-1"
                    style={{
                      gridTemplateColumns: 'repeat(52, minmax(0, 1fr))',
                    }}
                  >
                    {/* Generate 52 weeks of data */}
                    {Array.from({ length: 364 }).map((_, i) => {
                      const activity = Math.random()
                      let bgColor = 'bg-zinc-800'
                      if (activity > 0.7) bgColor = 'bg-green-600'
                      else if (activity > 0.5) bgColor = 'bg-green-500'
                      else if (activity > 0.2) bgColor = 'bg-green-400'
                      else if (activity > 0.05) bgColor = 'bg-green-300'

                      return (
                        <div
                          key={`activity-${i}`}
                          className={`w-3 h-3 rounded-sm ${bgColor}`}
                          title={`Activity level: ${activity.toFixed(2)}`}
                        ></div>
                      )
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-2 mt-4 text-xs text-zinc-400">
                  <span>Less</span>
                  <div className="w-2 h-2 bg-zinc-800 rounded-sm"></div>
                  <div className="w-2 h-2 bg-green-300 rounded-sm"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-sm"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
                  <div className="w-2 h-2 bg-green-600 rounded-sm"></div>
                  <span>More</span>
                </div>

                {/* Month Labels */}
                <div
                  className="flex gap-1 mt-3 ml-2"
                  style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}
                >
                  {[
                    'Nov',
                    'Dec',
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                  ].map((month, idx) => (
                    <span
                      key={`month-${idx}`}
                      className="text-xs text-zinc-500 flex-1 text-center"
                    >
                      {month}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Solved Problems Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Solved Problems</h2>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-zinc-800">
              <button className="pb-3 px-4 text-sm font-semibold text-blue-400 border-b-2 border-blue-500">
                Recent
              </button>
              <button className="pb-3 px-4 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                List
              </button>
              <button className="pb-3 px-4 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                Solution
              </button>
              <button className="pb-3 px-4 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
                Discuss
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Problems Container */}
              <div className="col-span-2">
                <div className="bg-zinc-900/50 border border-blue-900/50 rounded-lg p-6">
                  <div className="space-y-4">
                    {/* Problem 1 */}
                    <div className="flex justify-between items-center pb-4 border-b border-blue-900/30">
                      <div>
                        <h3 className="text-white font-semibold">
                          Pie Product Finder
                        </h3>
                        <p className="text-blue-400 text-sm">18 days ago</p>
                      </div>
                    </div>

                    {/* Problem 2 */}
                    <div className="flex justify-between items-center pb-4 border-b border-blue-900/30">
                      <div>
                        <h3 className="text-white font-semibold">
                          Word Awareness Chainer
                        </h3>
                        <p className="text-blue-400 text-sm">11 days ago</p>
                      </div>
                    </div>

                    {/* Problem 3 */}
                    <div className="flex justify-between items-center pb-4 border-b border-blue-900/30">
                      <div>
                        <h3 className="text-white font-semibold">
                          Merge K Sorted Lists
                        </h3>
                        <p className="text-blue-400 text-sm">1 month ago</p>
                      </div>
                    </div>

                    {/* Problem 4 */}
                    <div className="flex justify-between items-center pb-4 border-b border-blue-900/30">
                      <div>
                        <h3 className="text-white font-semibold">
                          Binary Tree Max Path
                        </h3>
                        <p className="text-blue-400 text-sm">1 month ago</p>
                      </div>
                    </div>

                    {/* Problem 5 */}
                    <div className="flex justify-between items-center pb-4 border-b border-blue-900/30">
                      <div>
                        <h3 className="text-white font-semibold">
                          Unique Triplet Sum
                        </h3>
                        <p className="text-blue-400 text-sm">1 month ago</p>
                      </div>
                    </div>

                    {/* Problem 6 */}
                    <div className="flex justify-between items-center pb-4 border-b border-blue-900/30">
                      <div>
                        <h3 className="text-white font-semibold">
                          Largest Increasing Subsequence
                        </h3>
                        <p className="text-blue-400 text-sm">1 month ago</p>
                      </div>
                    </div>

                    {/* Problem 7 */}
                    <div className="flex justify-between items-center pb-4 border-b border-blue-900/30">
                      <div>
                        <h3 className="text-white font-semibold">
                          Word Ladder Transform
                        </h3>
                        <p className="text-blue-400 text-sm">2 months ago</p>
                      </div>
                    </div>

                    {/* Problem 8 */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-semibold">
                          Min Stack Operations
                        </h3>
                        <p className="text-blue-400 text-sm">2 months ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Container */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mt-6">
                  <h3 className="text-xl font-bold mb-6">Skills</h3>
                  <div>
                    <div className="text-sm font-semibold text-white mb-4">
                      Advanced
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-blue-900/50 border border-blue-700 rounded-full text-xs text-white">
                        Divide and Conquer
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-white mb-4">
                      Intermediate
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-blue-900/50 border border-blue-700 rounded-full text-xs text-white">
                        Binary Tree
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-white mb-4">
                      Fundamental
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-900/50 border border-blue-700 rounded-full text-xs text-white">
                        Array
                      </span>
                      <span className="px-3 py-1 bg-blue-900/50 border border-blue-700 rounded-full text-xs text-white">
                        Sorting
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages Container */}
              <div className="col-span-1">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-6">Languages</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-white mb-1">
                        Go
                      </div>
                      <div className="text-xs text-zinc-400">
                        20 problems solved
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white mb-1">
                        Python
                      </div>
                      <div className="text-xs text-zinc-400">
                        34 problems solved
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white mb-1">
                        C++
                      </div>
                      <div className="text-xs text-zinc-400">
                        15 problems solved
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white mb-1">
                        JavaScript
                      </div>
                      <div className="text-xs text-zinc-400">
                        28 problems solved
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white mb-1">
                        React
                      </div>
                      <div className="text-xs text-zinc-400">
                        12 problems solved
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white mb-1">
                        Next.js
                      </div>
                      <div className="text-xs text-zinc-400">
                        8 problems solved
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Settings Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-40 max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-zinc-400 mb-8">Configure your settings!</p>

            <div className="space-y-6">
              {/* New Username */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  New Username
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-transparent border border-zinc-600 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
                />
              </div>

              {/* New Email */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  New Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-transparent border border-zinc-600 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
                />
              </div>

              {/* Change Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  Change Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-transparent border border-zinc-600 rounded px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
                />
              </div>
            </div>

            {/* Save Button */}
            <button className="w-full bg-white hover:bg-gray-100 text-black font-bold py-2 rounded transition-colors mt-8">
              Save
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
