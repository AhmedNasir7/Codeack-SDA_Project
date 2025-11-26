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
            {/* Create Battle */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center text-center">
              <Plus size={48} className="text-zinc-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Create Battle</h3>
              <p className="text-sm text-zinc-400 mb-6">
                Start a new coding battle and invite others
              </p>
              <button
                onClick={() => router.push('/challenges/coding-battle/1')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                CREATE NEW BATTLE
              </button>
            </div>

            {/* Quick Join */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center text-center">
              <Zap size={48} className="text-zinc-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Quick Join</h3>
              <p className="text-sm text-zinc-400 mb-6">
                Jump into an available battle instantly
              </p>
              <button
                onClick={() => router.push('/challenges/coding-battle/1')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                QUICK MATCH
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
    </main>
  )
}
