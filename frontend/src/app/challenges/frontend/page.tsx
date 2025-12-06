'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/authService'
import Navbar from '@/components/Navbar'
import { CheckCircle } from 'lucide-react'
import Loading from '@/components/Loading'

interface Challenge {
  frontend_id: number
  challenge_id: number
  design_mockup_url?: string
  design_template?: string
  required_technologies?: string[]
}

export default function FrontendPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null,
  )

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  // Hardcoded metadata based on frontend_id
  const getChallengeMetadata = (frontend_id: number) => {
    const metadata: {
      [key: number]: { title: string; description: string; difficulty: string }
    } = {
      1: {
        title: 'Responsive Landing Page',
        description:
          'Build a responsive landing page with navigation, hero section, and features grid',
        difficulty: 'Easy',
      },
      2: {
        title: 'Interactive Form with Validation',
        description:
          'Create a form with real-time validation and error messages',
        difficulty: 'Medium',
      },
      3: {
        title: 'Image Gallery with Lightbox',
        description: 'Build a responsive image gallery with a lightbox modal',
        difficulty: 'Medium',
      },
      4: {
        title: 'Todo App with Local Storage',
        description:
          'Create a todo app that saves data to browser local storage',
        difficulty: 'Hard',
      },
    }
    return (
      metadata[frontend_id] || {
        title: 'Challenge',
        description: '',
        difficulty: 'Easy',
      }
    )
  }

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = authService.getUser()
    setUser(currentUser)

    const fetchChallenges = async () => {
      try {
        // Fetch all frontend challenges
        const response = await fetch(`${API_BASE_URL}/frontend-challenge`)
        if (response.ok) {
          const frontendChallenges = await response.json()

          if (
            Array.isArray(frontendChallenges) &&
            frontendChallenges.length > 0
          ) {
            setChallenges(frontendChallenges)
          } else {
            setChallenges([])
          }
        } else {
          setChallenges([])
        }
      } catch (error) {
        setChallenges([])
      }
      setLoading(false)
    }

    fetchChallenges()
  }, [router])

  if (loading) {
    return <Loading />
  }

  const filteredChallenges = selectedDifficulty
    ? challenges.filter(
        (c) =>
          getChallengeMetadata(c.frontend_id).difficulty === selectedDifficulty,
      )
    : challenges

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
                        ? 'bg-blue-600 text-white border border-blue-500'
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
            {filteredChallenges && filteredChallenges.length > 0 ? (
              filteredChallenges.map((challenge) => {
                const metadata = getChallengeMetadata(challenge.frontend_id)
                return (
                  <div
                    key={challenge.frontend_id}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
                  >
                    {/* Difficulty Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          metadata.difficulty === 'Easy'
                            ? 'bg-green-950 text-green-400'
                            : metadata.difficulty === 'Medium'
                              ? 'bg-yellow-950 text-yellow-400'
                              : 'bg-red-950 text-red-400'
                        }`}
                      >
                        {metadata.difficulty}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2">{metadata.title}</h3>

                    {/* Description */}
                    <p className="text-sm text-zinc-400 mb-4">
                      {metadata.description}
                    </p>

                    {/* Start Button */}
                    <button
                      onClick={() =>
                        router.push(
                          `/challenges/frontend/${challenge.challenge_id}`,
                        )
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors"
                    >
                      START CHALLENGE
                    </button>
                  </div>
                )
              })
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-zinc-400 text-lg">
                  {challenges.length === 0
                    ? 'No frontend challenges available yet'
                    : 'No challenges match your filter'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
