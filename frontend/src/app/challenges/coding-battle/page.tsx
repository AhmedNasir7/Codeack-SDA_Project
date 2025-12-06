'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/authService'
import Navbar from '@/components/Navbar'
import { Plus, Zap, X } from 'lucide-react'

interface Battle {
  id: number
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  language: string
  participants: number
  timeLimit: number
  status: 'LIVE' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
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

  const battles: Battle[] = [
    {
      id: 1,
      title: 'Array Sorting Challenge',
      description: 'Challenge Description',
      difficulty: 'Beginner',
      language: 'Python',
      participants: 3,
      timeLimit: 30,
      status: 'LIVE',
    },
    {
      id: 2,
      title: 'Dynamic Programming Sprint',
      description: 'Challenge Description',
      difficulty: 'Intermediate',
      language: 'C++',
      participants: 4,
      timeLimit: 45,
      status: 'INTERMEDIATE',
    },
    {
      id: 3,
      title: 'Graph Algorithms Duel',
      description: 'Challenge Description',
      difficulty: 'Advanced',
      language: 'Java',
      participants: 2,
      timeLimit: 60,
      status: 'ADVANCED',
    },
    {
      id: 4,
      title: 'String Manipulation Wars',
      description: 'Challenge Description',
      difficulty: 'Beginner',
      language: 'JavaScript',
      participants: 4,
      timeLimit: 30,
      status: 'BEGINNER',
    },
    {
      id: 5,
      title: 'Binary Search Tree Challenge',
      description: 'Challenge Description',
      difficulty: 'Intermediate',
      language: 'Python',
      participants: 3,
      timeLimit: 40,
      status: 'INTERMEDIATE',
    },
    {
      id: 6,
      title: 'Competitive Programming Marathon',
      description: 'Challenge Description',
      difficulty: 'Advanced',
      language: 'C++',
      participants: 4,
      timeLimit: 90,
      status: 'ADVANCED',
    },
  ]

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = authService.getUser()
    setUser(currentUser)
    setLoading(false)
  }, [router])

  // Matchmaking countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (matchmakingModal && matchmakingTimeout > 0 && isMatching) {
      interval = setInterval(() => {
        setMatchmakingTimeout(prev => {
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
      const names = ['Alex Chen', 'Jordan Smith', 'Casey Morgan', 'Taylor Johnson', 'Morgan Riley', 'Sam Davis']
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
      router.push(`/challenges/coding-battle/${battleId}?opponent=${mockOpponent.id}`)
    }, delay)
  }

  const handleCreateCustomMatch = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setCustomMatchCode(code)
    setCustomMatchModal(true)
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
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
              <h2 className="text-xl font-bold">Active Battles</h2>
              <div className="flex gap-2">
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        selectedFilter === filter
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      {filter}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Battles Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {filteredBattles.map((battle) => (
              <div
                key={battle.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      statusBadgeColors[
                        battle.status as keyof typeof statusBadgeColors
                      ]
                    }`}
                  >
                    {battle.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-2">{battle.title}</h3>

                {/* Meta Info */}
                <div className="space-y-2 mb-4 text-sm text-zinc-400">
                  <div className="flex items-center justify-between">
                    <span>Participants:</span>
                    <span className="text-white">{battle.participants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Language:</span>
                    <span className="text-white">{battle.language}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Time:</span>
                    <span className="text-white">{battle.timeLimit} min</span>
                  </div>
                </div>

                {/* Join Button */}
                <button
                  onClick={() =>
                    router.push(`/challenges/coding-battle/${battle.id}`)
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors"
                >
                  JOIN BATTLE
                </button>
              </div>
            ))}
          </div>
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
            <h2 className="text-2xl font-bold text-white mb-4">Finding Opponent...</h2>

            {/* Countdown Timer */}
            <div className="text-5xl font-bold text-purple-400 mb-6">{matchmakingTimeout}s</div>

            {/* Loading Text */}
            <p className="text-zinc-400 mb-8">Searching for a worthy competitor</p>

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
              <p className="text-sm text-zinc-400 mb-3">Share this code with your friend:</p>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded p-4 flex items-center justify-between">
                <code className="text-2xl font-mono font-bold text-purple-400">{customMatchCode}</code>
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
                <strong>To join:</strong> Your friend can click "Join Match" on the battles page and enter this code.
              </p>
            </div>

            {/* Join Input */}
            <div className="mb-6">
              <p className="text-sm text-zinc-400 mb-3">Or join another player's match:</p>
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
                    const code = (document.getElementById('joinCode') as HTMLInputElement)?.value || ''
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
