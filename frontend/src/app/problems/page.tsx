'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/authService'
import Navbar from '@/components/Navbar'
import { Lock, Star, Search, Menu, Minimize2, Filter } from 'lucide-react'
import Loading from '@/components/Loading'

interface Problem {
  id: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  acceptance: number
  category: string
  solved: boolean
}

export default function ProblemsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('All Topics')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null,
  )
  const [userSubmissions, setUserSubmissions] = useState<any[]>([])

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = authService.getUser()
    setUser(currentUser)

    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch problems from backend
        const problemsResponse = await fetch(`${API_BASE_URL}/challenge`)
        const problemsData = (await problemsResponse.ok)
          ? await problemsResponse.json()
          : []

        // Fetch user submissions
        const dbUserId = authService.getDbUserId()
        let submissionsData: any[] = []
        if (dbUserId) {
          const submissionsResponse = await fetch(
            `${API_BASE_URL}/user-submissions/user/${dbUserId}`,
          )
          submissionsData = (await submissionsResponse.ok)
            ? await submissionsResponse.json()
            : []
        }

        setUserSubmissions(submissionsData)

        // Map backend data to frontend Problem interface
        const mappedProblems = problemsData.map((challenge: any) => ({
          id: challenge.challenge_id,
          title: challenge.title,
          difficulty: challenge.difficulty,
          acceptance: 50, // Placeholder - can be added to backend
          category: 'Algorithm', // Default category
          solved: submissionsData.some(
            (s) => s.challenge_id === challenge.challenge_id,
          ),
        }))

        setProblems(mappedProblems)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching problems:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return <Loading />
  }

  const filteredProblems = selectedDifficulty
    ? problems.filter((p) => p.difficulty === selectedDifficulty)
    : problems

  const easyCount = problems.filter((p) => p.difficulty === 'Easy').length
  const mediumCount = problems.filter((p) => p.difficulty === 'Medium').length
  const hardCount = problems.filter((p) => p.difficulty === 'Hard').length
  const solvedCount = problems.filter((p) => p.solved).length

  const difficultyColors = {
    Easy: 'text-green-400 bg-green-950/30',
    Medium: 'text-yellow-400 bg-yellow-950/30',
    Hard: 'text-red-400 bg-red-950/30',
  }

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white">
      <Navbar />

      {/* Main Content */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Filters Section */}
          <div className="mb-8">
            <div className="mb-2 flex gap-2">
              {['Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() =>
                    setSelectedDifficulty(
                      selectedDifficulty === diff ? null : diff,
                    )
                  }
                  className={`px-6 py-2 rounded-full text-xs font-medium transition-colors border ${
                    selectedDifficulty === diff
                      ? `${difficultyColors[diff as keyof typeof difficultyColors]} border-current`
                      : 'bg-slate-800/70 text-zinc-400 border-blue-500/50 hover:border-blue-400 hover:bg-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {/* Search Bar with Icons */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-transparent px-3 py-2 rounded-lg border border-zinc-700 flex-1">
                  <Search size={18} className="text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search questions"
                    className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none flex-1"
                  />
                </div>
                <button className="p-2 bg-slate-800/70 hover:bg-slate-700 rounded-lg transition-colors text-zinc-400 hover:text-white border border-blue-500/50">
                  <Menu size={18} />
                </button>
                <button className="p-2 bg-slate-800/70 hover:bg-slate-700 rounded-lg transition-colors text-zinc-400 hover:text-white border border-blue-500/50">
                  <Filter size={18} />
                </button>
              </div>

              {/* Category Tags with counts - Square borders below search */}
              <div className="flex flex-wrap gap-2 justify-center items-center">
                {[
                  { name: 'Array', count: 2847 },
                  { name: 'String', count: 623 },
                  { name: 'Hash Table', count: 735 },
                  { name: 'Math', count: 631 },
                  { name: 'Dynamic Programming', count: 629 },
                  { name: 'Sorting', count: 512 },
                ].map((cat) => (
                  <button
                    key={cat.name}
                    className="px-5 py-3 rounded border border-blue-500/50 text-xs font-medium transition-colors bg-slate-800/70 text-zinc-400 hover:text-white hover:border-blue-400 hover:bg-slate-700"
                  >
                    {cat.name} <br /> ({cat.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Difficulty Filter - Kept separate above content grid */}

          {/* Content Grid - Table and Chart Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Problems Table */}
            <div className="lg:col-span-3 bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-800/50">
                      <th className="px-4 py-3 text-left text-zinc-400 font-medium">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-zinc-400 font-medium">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-zinc-400 font-medium">
                        Acceptance
                      </th>
                      <th className="px-4 py-3 text-left text-zinc-400 font-medium">
                        Difficulty
                      </th>
                      <th className="px-4 py-3 text-center text-zinc-400 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProblems.map((problem, idx) => (
                      <tr
                        key={problem.id}
                        className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-zinc-400">{idx + 1}</td>
                        <td
                          className="px-4 py-3 text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
                          onClick={() => router.push(`/problems/${problem.id}`)}
                        >
                          {problem.title}
                        </td>
                        <td className="px-4 py-3 text-zinc-400">
                          {problem.acceptance}%
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${difficultyColors[problem.difficulty]}`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button className="text-zinc-400 hover:text-yellow-400 transition-colors inline-flex">
                            <Star size={18} />
                          </button>
                          <button className="text-zinc-400 hover:text-yellow-400 transition-colors ml-3 inline-flex">
                            <Lock size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Problems Solved Chart */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 flex flex-col items-center">
              <h3 className="text-sm font-semibold mb-4 text-center">
                Problems Solved
              </h3>
              <div className="relative w-32 h-32 mb-4">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {/* Easy arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="8"
                    strokeDasharray={`${(easyCount / 6) * 251} 251`}
                  />
                  {/* Medium arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="8"
                    strokeDasharray={`${(mediumCount / 6) * 251} 251`}
                    strokeDashoffset={-((easyCount / 6) * 251)}
                  />
                  {/* Hard arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="8"
                    strokeDasharray={`${(hardCount / 6) * 251} 251`}
                    strokeDashoffset={
                      -((easyCount / 6) * 251 + (mediumCount / 6) * 251)
                    }
                  />
                </svg>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-zinc-400">Easy {easyCount}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span className="text-zinc-400">Mid {mediumCount}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span className="text-zinc-400">Hard {hardCount}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
