'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/authService'
import Navbar from '@/components/Navbar'
import { Plus, Zap, X } from 'lucide-react'
import Loading from '@/components/Loading'

interface Battle {
  tournament_id: number
  tournament_name: string
  start_date: string
  end_date: string
  prize_pool: number
  status: string
  leaderboard_id: number
  created_at: string
}

export default function CodingBattlePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [matchmakingModal, setMatchmakingModal] = useState(false)
  const [customMatchModal, setCustomMatchModal] = useState(false)
  const [matchmakingTimeout, setMatchmakingTimeout] = useState(60)
  const [customMatchCode, setCustomMatchCode] = useState('')
  const [opponent, setOpponent] = useState<any>(null)
  const [isMatching, setIsMatching] = useState(false)
  const [battles, setBattles] = useState<Battle[]>([])
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = authService.getUser()
    setUser(currentUser)
    fetchTournaments()
  }, [router])

  const fetchTournaments = async () => {
    try {
      setError(null)
      const url = `${API_BASE_URL}/tournament/active`
      console.log('Fetching from:', url)

      const response = await fetch(url)

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Failed to fetch tournaments: ${response.status}`)
      }

      const activeTournaments = await response.json()
      console.log('Tournaments fetched:', activeTournaments)
      setBattles(activeTournaments || [])
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load tournaments'
      setError(message)
      console.error('Error fetching tournaments:', err)
      setBattles([])
    } finally {
      setLoading(false)
    }
  }

  // Matchmaking countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (matchmakingModal && matchmakingTimeout > 0 && isMatching) {
      interval = setInterval(() => {
        setMatchmakingTimeout((prev) => {
          if (prev <= 1) {
            setMatchmakingModal(false)
            setIsMatching(false)
            return 60
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [matchmakingModal, matchmakingTimeout, isMatching])

  const handleQuickMatch = () => {
    setIsMatching(true)
    setMatchmakingTimeout(60)
    setMatchmakingModal(true)

    // Simulate finding opponent after 3-8 seconds
    const delay = Math.random() * 5000 + 3000
    setTimeout(() => {
      const names = [
        'Alex Chen',
        'Jordan Smith',
        'Casey Morgan',
        'Taylor Johnson',
        'Morgan Riley',
        'Sam Davis',
      ]
      const mockOpponent = {
        id: Math.random(),
        name: names[Math.floor(Math.random() * names.length)],
        rating: Math.floor(Math.random() * 1500) + 500,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      }
      setOpponent(mockOpponent)
      setMatchmakingModal(false)
      setIsMatching(false)

      // Generate battleId and navigate to editor with opponent
      const battleId = Math.floor(Math.random() * 1000) + 1
      router.push(
        `/challenges/coding-battle/${battleId}?opponent=${mockOpponent.id}`,
      )
    }, delay)
  }

  const handleCreateCustomMatch = async () => {
    try {
      // Generate match code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()

      // Calculate dates
      const startDate = new Date()
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hour from now

      // Create tournament in database
      const response = await fetch(`${API_BASE_URL}/tournament`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournament_name: `Custom Battle - ${code}`,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          prize_pool: 0,
          status: 'Active',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create tournament')
      }

      const tournament = await response.json()

      // Store match code and tournament ID
      setCustomMatchCode(code)
      setCustomMatchModal(true)

      // Refresh tournaments list to show the new one
      await fetchTournaments()
    } catch (err) {
      console.error('Error creating custom match:', err)
      alert('Failed to create custom battle. Please try again.')
    }
  }

  const handleJoinCustomMatch = (code: string) => {
    if (!code || code.length !== 6) {
      alert('Invalid code. Please enter a 6-character code.')
      return
    }

    // In real app, this would validate with backend
    const battleId = Math.floor(Math.random() * 1000) + 1
    router.push(`/challenges/coding-battle/${battleId}?joinCode=${code}`)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(customMatchCode)
    alert('Code copied to clipboard!')
  }

  if (loading) {
    return <Loading />
  }

  const statusBadgeColors = {
    LIVE: 'bg-green-950 text-green-400',
    BEGINNER: 'bg-green-950 text-green-400',
    INTERMEDIATE: 'bg-yellow-950 text-yellow-400',
    ADVANCED: 'bg-red-950 text-red-400',
  }

  const filteredBattles =
    selectedFilter === 'All'
      ? battles
      : battles.filter(
          (battle) => battle.status === selectedFilter.toUpperCase(),
        )

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white">
      <Navbar />

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">
              Multiplayer Battle Arena
            </h1>
            <p className="text-zinc-400">
              Compete in real-time coding battles with developers worldwide
            </p>
          </div>

          {/* Create Battle & Quick Join */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Create Custom Match */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center text-center">
              <Plus size={48} className="text-zinc-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Create Custom Match</h3>
              <p className="text-sm text-zinc-400 mb-6">
                Generate a code and invite a friend to compete
              </p>
              <button
                onClick={handleCreateCustomMatch}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isMatching}
              >
                CREATE CODE
              </button>
            </div>

            {/* Quick Match */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center text-center">
              <Zap size={48} className="text-zinc-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Quick Match</h3>
              <p className="text-sm text-zinc-400 mb-6">
                Find a random opponent instantly
              </p>
              <button
                onClick={handleQuickMatch}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isMatching}
              >
                {isMatching ? 'FINDING OPPONENT...' : 'QUICK MATCH'}
              </button>
            </div>
          </div>

          {/* Active Battles */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                Coding Battles (Tournaments)
              </h2>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {/* Battles Grid */}
          {battles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg">
                No active tournaments available
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {battles.map((battle) => (
                <div
                  key={battle.tournament_id}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-green-950 text-green-400">
                      {battle.status || 'ACTIVE'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold mb-2">
                    {battle.tournament_name}
                  </h3>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4 text-sm text-zinc-400">
                    <div className="flex items-center justify-between">
                      <span>Prize Pool:</span>
                      <span className="text-white">
                        ${battle.prize_pool?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Start Date:</span>
                      <span className="text-white">
                        {new Date(battle.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Leaderboard:</span>
                      <span className="text-white">
                        #{battle.leaderboard_id}
                      </span>
                    </div>
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={() =>
                      router.push(
                        `/challenges/coding-battle/${battle.tournament_id}`,
                      )
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors"
                  >
                    JOIN BATTLE
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Matchmaking Modal */}
      {matchmakingModal && isMatching && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl w-full max-w-md p-8 text-center">
            {/* Spinner */}
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500"></div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-4">
              Finding Opponent...
            </h2>

            {/* Countdown Timer */}
            <div className="text-5xl font-bold text-purple-400 mb-6">
              {matchmakingTimeout}s
            </div>

            {/* Loading Text */}
            <p className="text-zinc-400 mb-8">
              Searching for a worthy competitor
            </p>

            {/* Cancel Button */}
            <button
              onClick={() => {
                setMatchmakingModal(false)
                setIsMatching(false)
              }}
              className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Custom Match Modal */}
      {customMatchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl w-full max-w-md p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Custom Match</h2>
              <button
                onClick={() => setCustomMatchModal(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Code Display */}
            <div className="mb-6">
              <p className="text-sm text-zinc-400 mb-3">
                Share this code with your friend:
              </p>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded p-4 flex items-center justify-between">
                <code className="text-2xl font-mono font-bold text-purple-400">
                  {customMatchCode}
                </code>
                <button
                  onClick={handleCopyCode}
                  className="ml-4 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition-colors text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Join Instructions */}
            <div className="mb-6 p-4 bg-zinc-800/30 border border-zinc-700 rounded">
              <p className="text-sm text-zinc-300">
                <strong>To join:</strong> Your friend can click "Join Match" on
                the battles page and enter this code.
              </p>
            </div>

            {/* Join Input */}
            <div className="mb-6">
              <p className="text-sm text-zinc-400 mb-3">
                Or join another player's match:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter match code"
                  maxLength={6}
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  id="joinCode"
                />
                <button
                  onClick={() => {
                    const code =
                      (document.getElementById('joinCode') as HTMLInputElement)
                        ?.value || ''
                    if (code) {
                      handleJoinCustomMatch(code)
                      setCustomMatchModal(false)
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition-colors"
                >
                  Join
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setCustomMatchModal(false)}
              className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
