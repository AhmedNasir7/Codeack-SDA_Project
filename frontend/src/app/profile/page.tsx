'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/authService'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import Loading from '@/components/Loading'

interface UserData {
  user: any
  portfolio: any
  submissions: any[]
  teams: any[]
  tournaments: any[]
  leaderboardEntry: any
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const dbUserId = authService.getDbUserId()
      if (!dbUserId) {
        throw new Error('User ID not found')
      }

      const updatePayload: any = {}
      if (formData.username) updatePayload.username = formData.username
      if (formData.email) updatePayload.email = formData.email
      if (formData.password) updatePayload.password_hash = formData.password

      if (Object.keys(updatePayload).length === 0) {
        throw new Error('Please enter at least one field to update')
      }

      const response = await fetch(`${API_BASE_URL}/users/${dbUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update user')
      }

      const updatedUser = await response.json()

      // Update localStorage with new data
      if (formData.username) {
        authService.setUser({
          ...authService.getUser(),
          username: formData.username,
        })
      }
      if (formData.email) {
        authService.setEmail(formData.email)
      }

      setSubmitSuccess(true)
      setFormData({ username: '', email: '', password: '' })

      // Refresh user data
      const currentUserResponse = await authService.getCurrentUser()
      if (currentUserResponse) {
        setUserData((prev) =>
          prev
            ? {
                ...prev,
                user: currentUserResponse.user,
                portfolio: currentUserResponse.portfolio,
              }
            : null,
        )
      }

      setTimeout(() => {
        setIsModalOpen(false)
        setSubmitSuccess(false)
      }, 2000)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to update user',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)

        const userEmail = authService.getEmail()
        const dbUserId = authService.getDbUserId()

        if (!userEmail || !dbUserId) {
          throw new Error('User info not found in storage')
        }

        // 1. Get user data from backend (includes portfolio)
        const currentUserResponse = await authService.getCurrentUser()
        const { user, portfolio } = currentUserResponse

        // 2. Get user submissions (chain via user_id)
        const submissionsResponse = await fetch(
          `${API_BASE_URL}/user-submissions/user/${dbUserId}`,
        )
        const submissions = submissionsResponse.ok
          ? await submissionsResponse.json()
          : []

        // 3. Get user's team memberships (chain via user_id)
        const teamMembersResponse = await fetch(
          `${API_BASE_URL}/team-members/user/${dbUserId}`,
        )
        const teamMembers = teamMembersResponse.ok
          ? await teamMembersResponse.json()
          : []

        // 4. Get team details for each team membership
        const teams = await Promise.all(
          teamMembers.map(async (member: any) => {
            const teamResponse = await fetch(
              `${API_BASE_URL}/team/${member.team_id}`,
            )
            return teamResponse.ok ? await teamResponse.json() : null
          }),
        )

        // 5. Get tournament participations (chain via user_id)
        const tournamentsResponse = await fetch(
          `${API_BASE_URL}/tournament-participants/user/${dbUserId}`,
        )
        const tournamentParticipants = tournamentsResponse.ok
          ? await tournamentsResponse.json()
          : []

        // 6. Get tournament details for each participation
        const tournaments = await Promise.all(
          tournamentParticipants.map(async (participant: any) => {
            const tournamentResponse = await fetch(
              `${API_BASE_URL}/tournament/${participant.tournament_id}`,
            )
            return tournamentResponse.ok
              ? await tournamentResponse.json()
              : null
          }),
        )

        // 7. Get leaderboard entry (chain via user_id)
        const leaderboardResponse = await fetch(
          `${API_BASE_URL}/leaderboard-entries/user/${dbUserId}`,
        )
        const leaderboardEntries = leaderboardResponse.ok
          ? await leaderboardResponse.json()
          : []

        setUserData({
          user,
          portfolio,
          submissions: submissions.filter((s: any) => s),
          teams: teams.filter((t: any) => t),
          tournaments: tournaments.filter((t: any) => t),
          leaderboardEntry: leaderboardEntries[0] || null,
        })

        setFormData({
          username: user?.username || '',
          email: user?.email || '',
          password: '',
        })
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">No user data found</p>
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
                  {userData?.user?.username || 'User'}
                </h2>

                {/* Edit Profile Button */}
                <button
                  onClick={() => {
                    setFormData({
                      username: userData?.user?.username || '',
                      email: userData?.user?.email || '',
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

                {/* Stats */}
                <div className="flex flex-col items-center gap-8">
                  <div className="w-full space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">Solved Questions</span>
                      <span className="text-white font-bold text-lg">
                        {userData?.portfolio?.solved_questions || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">Total Score</span>
                      <span className="text-white font-bold text-lg">
                        {userData?.portfolio?.total_score || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">Rank Level</span>
                      <span className="text-white font-bold text-lg">
                        {userData?.portfolio?.rank_level || 'Unranked'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300">Submissions</span>
                      <span className="text-white font-bold text-lg">
                        {userData?.submissions?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Stats */}
            <div className="col-span-5">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 h-full">
                <h2 className="text-xl font-bold mb-8">Profile Stats</h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-700">
                    <span className="text-zinc-300">Email</span>
                    <span className="text-white font-semibold text-xs">
                      {userData?.user?.email}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-zinc-700">
                    <span className="text-zinc-300">Teams</span>
                    <span className="text-white font-bold">
                      {userData?.teams?.length || 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-zinc-700">
                    <span className="text-zinc-300">Tournaments</span>
                    <span className="text-white font-bold">
                      {userData?.tournaments?.length || 0}
                    </span>
                  </div>

                  {userData?.leaderboardEntry && (
                    <>
                      <div className="flex justify-between items-center pb-3 border-b border-zinc-700">
                        <span className="text-zinc-300">Leaderboard Rank</span>
                        <span className="text-white font-bold">
                          #{userData.leaderboardEntry.rank_position}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b border-zinc-700">
                        <span className="text-zinc-300">Challenges Solved</span>
                        <span className="text-white font-bold">
                          {userData.leaderboardEntry.challenges_solved || 0}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-300">Member Since</span>
                    <span className="text-white font-semibold text-xs">
                      {userData?.user?.created_at
                        ? new Date(
                            userData.user.created_at,
                          ).toLocaleDateString()
                        : 'N/A'}
                    </span>
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
                      Submissions in past year:{' '}
                      {userData?.submissions?.length || 0}
                    </h3>
                  </div>
                  <div className="space-y-1 text-right text-sm text-zinc-400">
                    <div>
                      Total submissions:{' '}
                      <span className="text-white font-bold">
                        {userData?.submissions?.length || 0}
                      </span>
                    </div>
                    <div>
                      Languages Used:{' '}
                      <span className="text-white font-bold">
                        {userData?.submissions?.length > 0
                          ? new Set(
                              userData.submissions
                                .filter((s: any) => s?.language)
                                .map((s: any) => s.language),
                            ).size
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity Graph - Hardcoded Static Grid */}
                <div className="flex justify-center pb-4">
                  <div
                    className="inline-grid gap-1"
                    style={{
                      gridTemplateColumns: 'repeat(52, minmax(0, 1fr))',
                    }}
                  >
                    {/* 52 weeks x 7 days = 364 hardcoded squares with green tones */}
                    {Array.from({ length: 364 }).map((_, i) => {
                      // Cycle through different green tones
                      const pattern = i % 20
                      let colorClass = 'bg-zinc-800'
                      if (
                        pattern === 0 ||
                        pattern === 5 ||
                        pattern === 10 ||
                        pattern === 15
                      )
                        colorClass = 'bg-green-600'
                      else if (pattern === 1 || pattern === 6 || pattern === 11)
                        colorClass = 'bg-green-500'
                      else if (pattern === 2 || pattern === 7 || pattern === 12)
                        colorClass = 'bg-green-400'
                      else if (pattern === 3 || pattern === 8)
                        colorClass = 'bg-green-300'

                      return (
                        <div
                          key={`activity-${i}`}
                          className={`w-3 h-3 rounded-sm ${colorClass} hover:opacity-80 transition-opacity`}
                          title={`Day ${i + 1}`}
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
                Recent Submissions
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Problems Container */}
              <div className="col-span-2">
                <div className="bg-zinc-900/50 border border-blue-900/50 rounded-lg p-6">
                  {userData?.submissions && userData.submissions.length > 0 ? (
                    <div className="space-y-4">
                      {userData.submissions
                        .slice(0, 10)
                        .map((submission: any, idx: number) => (
                          <div
                            key={`submission-${idx}`}
                            className="flex justify-between items-center pb-4 border-b border-blue-900/30"
                          >
                            <div className="flex-1">
                              <h3 className="text-white font-semibold">
                                Challenge ID: {submission.challenge_id}
                              </h3>
                              <p className="text-blue-400 text-sm">
                                Language: {submission.language || 'N/A'} |
                                Score: {submission.score || 0}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-zinc-400 text-sm">
                                Time: {submission.execution_time || 0}ms
                              </p>
                              <p className="text-zinc-400 text-sm">
                                Memory: {submission.memory_used || 0}MB
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-zinc-400">No submissions yet</p>
                    </div>
                  )}
                </div>

                {/* Teams Container */}
                {userData?.teams && userData.teams.length > 0 && (
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mt-6">
                    <h3 className="text-xl font-bold mb-6">Teams</h3>
                    <div className="space-y-4">
                      {userData.teams.map((team: any, idx: number) => (
                        <div
                          key={`team-${idx}`}
                          className="flex justify-between items-center pb-4 border-b border-zinc-700"
                        >
                          <div>
                            <h4 className="text-white font-semibold">
                              {team.team_name}
                            </h4>
                            <p className="text-zinc-400 text-sm">
                              Members: {team.member_count || 0}
                            </p>
                          </div>
                          <span className="text-white font-bold">
                            {team.total_score || 0} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Languages Container */}
              <div className="col-span-1">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-6">Languages Used</h3>
                  {userData?.submissions && userData.submissions.length > 0 ? (
                    <div className="space-y-4">
                      {Array.from(
                        new Set(
                          userData.submissions.map((s: any) => s.language),
                        ),
                      ).map((lang: any, idx: number) => {
                        const count = userData.submissions.filter(
                          (s: any) => s.language === lang,
                        ).length
                        return (
                          <div key={`lang-${idx}`}>
                            <div className="text-sm font-semibold text-white mb-1">
                              {lang || 'Unknown'}
                            </div>
                            <div className="text-xs text-zinc-400">
                              {count} submissions
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-zinc-400 text-sm">
                        No submissions yet
                      </p>
                    </div>
                  )}
                </div>

                {/* Tournaments Container */}
                {userData?.tournaments && userData.tournaments.length > 0 && (
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 mt-6">
                    <h3 className="text-xl font-bold mb-6">Tournaments</h3>
                    <div className="space-y-4">
                      {userData.tournaments.map(
                        (tournament: any, idx: number) => (
                          <div
                            key={`tournament-${idx}`}
                            className="flex flex-col gap-2"
                          >
                            <p className="text-white font-semibold text-sm">
                              {tournament.tournament_name}
                            </p>
                            <p className="text-zinc-400 text-xs">
                              Status: {tournament.status || 'N/A'}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
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
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>
            <p className="text-zinc-400 mb-6">
              Update your account information
            </p>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              {submitError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-red-400 text-sm">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-green-400 text-sm">
                  Profile updated successfully!
                </div>
              )}

              {/* New Username */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Username (optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter new username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              {/* New Email */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  placeholder="Enter new email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              {/* Change Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Password (optional)
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 rounded transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
