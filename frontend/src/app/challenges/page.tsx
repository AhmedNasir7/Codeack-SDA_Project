'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/authService'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Loading from '@/components/Loading'

interface Challenge {
  id: number
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  type: string
  image: string
}

export default function ChallengesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const featuredChallenges: Challenge[] = [
    {
      id: 1,
      title: 'Coding Battle',
      description: 'Compete against others in real-time coding challenges.',
      difficulty: 'Medium',
      type: 'Competitive',
      image: '/challenges_coding_battle.svg',
    },
    {
      id: 2,
      title: 'Bug-Fixing Challenge',
      description: 'Identify and fix bugs in provided code snippets.',
      difficulty: 'Easy',
      type: 'Debugging',
      image: '/challenges_bug_fixing.svg',
    },
    {
      id: 3,
      title: 'Front-End Challenge',
      description: 'Showcase your skills with exciting projects.',
      difficulty: 'Medium',
      type: 'Frontend',
      image: '/challenges_frontend_challenge.svg',
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
    return <Loading />
  }

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white flex flex-col">
      <Navbar />

      <div className="px-6 py-8 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">
              Welcome to Coding Challenges!
            </h1>
            <p className="text-zinc-400">
              Test your skills and compete with others!
            </p>
          </div>

          {/* Featured Challenges Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="flex flex-col items-center text-center"
              >
                {/* Image Container */}
                <div className="mb-6 w-48 h-48 bg-linear-to-br from-blue-900/40 to-purple-900/40 rounded-xl border border-zinc-800 flex items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={challenge.image}
                      alt={challenge.title}
                      fill
                      className="object-contain p-4"
                      suppressHydrationWarning
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Challenge Info */}
                <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Join Button */}
                <button
                  onClick={() => {
                    const routes: { [key: number]: string } = {
                      1: '/challenges/coding-battle',
                      2: '/challenges/bug-fixing',
                      3: '/challenges/frontend',
                    }
                    router.push(routes[challenge.id])
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Join Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Participate Section - Fixed at Bottom */}
      <div className="mt-auto px-6 py-8 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Why Participate?</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Participating in coding challenges helps you improve your coding
            skills, learn new technologies, and connect with other developers.
            Whether you're a beginner or an experienced coder, there's something
            for everyone!
          </p>
        </div>
      </div>
    </main>
  )
}
