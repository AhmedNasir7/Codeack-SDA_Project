'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/authService'
import Navbar from '@/components/Navbar'
import { CheckCircle } from 'lucide-react'

interface Challenge {
  id: number
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  points: number
  solves: number
  status?: 'EASY' | 'MEDIUM' | 'HARD' | 'COMPLETED'
  tags: string[]
}

export default function FrontendPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null,
  )

  const challenges: Challenge[] = [
    {
      id: 1,
      title: 'Responsive Card Grid',
      description: 'Build a fully responsive card grid using modern CSS',
      difficulty: 'Easy',
      points: 50,
      solves: 234,
      status: 'EASY',
      tags: ['HTML', 'CSS', 'Responsive'],
    },
    {
      id: 2,
      title: 'Interactive Form Validator',
      description: 'Create a form with real-time validation and error handling',
      difficulty: 'Medium',
      points: 150,
      solves: 89,
      status: 'MEDIUM',
      tags: ['JavaScript', 'Forms', 'UX'],
    },
    {
      id: 3,
      title: 'Smooth Page Animation',
      description: 'Build animated page transitions using modern libraries',
      difficulty: 'Hard',
      points: 250,
      solves: 12,
      status: 'HARD',
      tags: ['Animation', 'TypeScript', 'Performance'],
    },
    {
      id: 4,
      title: 'Navigation Menu System',
      description: 'Build a responsive navigation with dropdowns',
      difficulty: 'Medium',
      points: 150,
      solves: 45,
      status: 'MEDIUM',
      tags: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      id: 5,
      title: 'Image Gallery Slider',
      description:
        'Create an interactive image gallery with smooth transitions',
      difficulty: 'Medium',
      points: 150,
      solves: 156,
      status: 'MEDIUM',
      tags: ['Gallery', 'Slider', 'CSS'],
    },
    {
      id: 6,
      title: 'Todo App with Filters',
      description:
        'Build a fully functional todo app with filtering capabilities',
      difficulty: 'Hard',
      points: 250,
      solves: 78,
      status: 'HARD',
      tags: ['JavaScript', 'DOM', 'Storage'],
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

  const filteredChallenges = selectedDifficulty
    ? challenges.filter((c) => c.difficulty === selectedDifficulty)
    : challenges

  const difficultyColors = {
    Easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  const statusBadgeColors = {
    EASY: 'bg-green-950 text-green-400',
    MEDIUM: 'bg-yellow-950 text-yellow-400',
    HARD: 'bg-red-950 text-red-400',
    COMPLETED: 'bg-zinc-950 text-zinc-400',
  }

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white">
      <Navbar />

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Frontend Challenges</h1>
            <p className="text-zinc-400">
              Master HTML, CSS, and JavaScript by building real-world UI
              components
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-400">24</div>
              <div className="text-sm text-zinc-400">Total Tasks</div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-400">92%</div>
              <div className="text-sm text-zinc-400">Success Rate</div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-400">8</div>
              <div className="text-sm text-zinc-400">Unsolved</div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-400">1250</div>
              <div className="text-sm text-zinc-400">Total Points</div>
            </div>
          </div>

          {/* Available Challenges */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Available Challenges</h2>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() =>
                      setSelectedDifficulty(
                        selectedDifficulty === diff ? null : diff,
                      )
                    }
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      selectedDifficulty === diff
                        ? `${difficultyColors[diff as keyof typeof difficultyColors]} border`
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Challenges Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      statusBadgeColors[
                        challenge.status as keyof typeof statusBadgeColors
                      ]
                    }`}
                  >
                    {challenge.status}
                  </span>
                  <span className="text-blue-400 font-bold">
                    +{challenge.points} pts
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-2">{challenge.title}</h3>

                {/* Description */}
                <p className="text-sm text-zinc-400 mb-4">
                  {challenge.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {challenge.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-zinc-800/50 text-zinc-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-2 mb-4 text-xs text-zinc-400">
                  <CheckCircle size={14} />
                  <span>{challenge.solves} solves</span>
                </div>

                {/* Start Button */}
                <button
                  onClick={() =>
                    router.push(`/challenges/frontend/${challenge.id}`)
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors"
                >
                  START CHALLENGE
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
