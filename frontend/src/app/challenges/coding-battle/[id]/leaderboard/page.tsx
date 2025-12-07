'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Loading from '@/components/Loading'

interface Participant {
  id: number
  tournament_id: number
  user_id: number
  registration_date: string
  final_rank: number
  final_score: number
}

export default function TournamentLeaderboard() {
  const { id: tournamentId } = useParams()
  const router = useRouter()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [tournament, setTournament] = useState<any>(null)

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tournament details
        const tourneyRes = await fetch(
          `${API_BASE_URL}/tournament/${tournamentId}`,
        )
        if (tourneyRes.ok) {
          const tourneyData = await tourneyRes.json()
          setTournament(tourneyData)
        }

        // Fetch tournament participants with results
        const participantsRes = await fetch(
          `${API_BASE_URL}/tournament-participants/tournament/${tournamentId}`,
        )
        if (participantsRes.ok) {
          const participantsData = await participantsRes.json()
          // Sort by final_rank
          const sorted = participantsData.sort(
            (a: Participant, b: Participant) =>
              (a.final_rank || 999) - (b.final_rank || 999),
          )
          setParticipants(sorted)
        }
      } catch (err) {
        console.error('Error fetching leaderboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [tournamentId])

  if (loading) {
    return <Loading />
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-[#0a0e27] via-[#0d1117] to-[#0a0e27] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold">Tournament Results</h1>
            <button
              onClick={() => router.push('/challenges/coding-battle')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
            >
              Back to Tournaments
            </button>
          </div>
          {tournament && (
            <p className="text-zinc-400">
              Tournament #{tournamentId} - {tournament.tournament_name}
            </p>
          )}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50 border-b border-zinc-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                    User ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                    Questions Solved
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                    Registration Date
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-zinc-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {participants.map((participant, index) => (
                  <tr
                    key={participant.id}
                    className={`hover:bg-zinc-800/30 transition-colors ${
                      index === 0 ? 'bg-yellow-900/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && <span className="text-2xl">🏆</span>}
                        {index === 1 && <span className="text-2xl">🥈</span>}
                        {index === 2 && <span className="text-2xl">🥉</span>}
                        <span className="font-bold text-white">
                          #{participant.final_rank || index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-zinc-300">
                        User {participant.user_id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-400">
                          {participant.final_score}/5
                        </span>
                        <div className="w-20 h-2 bg-zinc-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
                            style={{
                              width: `${(participant.final_score / 5) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-sm">
                      {new Date(
                        participant.registration_date,
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          participant.final_rank === 1
                            ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                            : participant.final_rank === 2
                              ? 'bg-red-900/30 text-red-400 border border-red-700/50'
                              : 'bg-zinc-800/50 text-zinc-300 border border-zinc-700/50'
                        }`}
                      >
                        {participant.final_rank === 1
                          ? '🎉 Winner'
                          : participant.final_rank === 2
                            ? 'Runner-up'
                            : 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {participants.length === 0 && (
            <div className="p-8 text-center text-zinc-400">
              <p className="text-lg">No participants in this tournament yet.</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <p className="text-zinc-400 text-sm mb-2">Total Participants</p>
            <p className="text-3xl font-bold text-white">
              {participants.length}
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <p className="text-zinc-400 text-sm mb-2">Tournament Status</p>
            <p className="text-3xl font-bold text-green-400">✓ Completed</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <p className="text-zinc-400 text-sm mb-2">Average Score</p>
            <p className="text-3xl font-bold text-blue-400">
              {participants.length > 0
                ? (
                    participants.reduce(
                      (sum, p) => sum + (p.final_score || 0),
                      0,
                    ) / participants.length
                  ).toFixed(1)
                : '0'}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
