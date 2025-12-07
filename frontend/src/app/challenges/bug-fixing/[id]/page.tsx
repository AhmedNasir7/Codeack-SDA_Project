'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { compilerService, RunCodeResponse } from '@/lib/compilerService'
import { authService } from '@/lib/authService'
import Loading from '@/components/Loading'

interface BugFixingChallengeData {
  bug_fix_id: number
  challenge_id: number
  buggy_code: string
  number_of_bugs?: number
  expected_output?: string
  penalty_rules?: string
}

interface ChallengeData {
  challenge_id: number
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  allowed_languages?: string[]
}

interface BugChallenge extends ChallengeData {
  buggyCode: string
  expectedOutput: string
  numberOfBugs?: number
}

export default function BugFixingEditorPage() {
  const router = useRouter()
  const params = useParams()
  const challengeId = params.id as string
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [challenge, setChallenge] = useState<BugChallenge | null>(null)

  type LanguageValue = 'python' | 'javascript' | 'cpp' | 'java' | 'go'

  interface LanguagePreset {
    value: LanguageValue
    label: string
    judge0Id: number
    template: string
  }

  const LANGUAGE_PRESETS: LanguagePreset[] = [
    {
      value: 'python',
      label: 'Python',
      judge0Id: 71,
      template: `# fix the code here`,
    },
    {
      value: 'javascript',
      label: 'JavaScript',
      judge0Id: 63,
      template: `// fix the code here`,
    },
    {
      value: 'cpp',
      label: 'C++',
      judge0Id: 54,
      template: `// fix the code here`,
    },
    {
      value: 'java',
      label: 'Java',
      judge0Id: 62,
      template: `// fix the code here`,
    },
    {
      value: 'go',
      label: 'Go',
      judge0Id: 60,
      template: `// fix the code here`,
    },
  ]

  const [language, setLanguage] = useState<LanguageValue>(
    LANGUAGE_PRESETS[0].value,
  )
  const [code, setCode] = useState(LANGUAGE_PRESETS[0].template)
  const languagePreset = useMemo(
    () => LANGUAGE_PRESETS.find((p) => p.value === language),
    [language],
  )

  const [isRunning, setIsRunning] = useState(false)
  const [runResult, setRunResult] = useState<RunCodeResponse | null>(null)
  const [runError, setRunError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [matchPercentage, setMatchPercentage] = useState(0)
  const [submissionMessage, setSubmissionMessage] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  // Hardcoded fallback challenges
  const hardcodedChallenges: { [key: number]: BugChallenge } = {
    41: {
      challenge_id: 41,
      title: 'Array Index Out of Bounds',
      description: 'Fix the loop condition causing array overflow',
      difficulty: 'Easy',
      buggyCode: `function calculateSum(arr) {
    let sum = 0;
    for (let i = 0; i <= arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

console.log(calculateSum([1, 2, 3, 4, 5]));`,
      expectedOutput: '15',
      numberOfBugs: 1,
    },
    42: {
      challenge_id: 42,
      title: 'Null Pointer Exception',
      description:
        'Fix the code that handles null references in object access.',
      difficulty: 'Medium',
      buggyCode: `def process_data(data):
    result = []
    for item in data:
        value = item["key"]
        result.append(value * 2)
    return result

print(process_data([{"key": 5}]))`,
      expectedOutput: '[10]',
      numberOfBugs: 1,
    },
    43: {
      challenge_id: 43,
      title: 'String Indexing Error',
      description: 'Fix the string manipulation function.',
      difficulty: 'Easy',
      buggyCode: `def reverse_string(s):
    result = ""
    for i in range(len(s)):
        result = s[i] + result
    return result

print(reverse_string("hello"))`,
      expectedOutput: 'olleh',
      numberOfBugs: 1,
    },
    44: {
      challenge_id: 44,
      title: 'Race Condition in Threading',
      description: 'Fix synchronization issues in multithreaded code.',
      difficulty: 'Hard',
      buggyCode: `import threading

counter = 0

def increment():
    global counter
    for _ in range(100000):
        counter += 1

t1 = threading.Thread(target=increment)
t2 = threading.Thread(target=increment)

t1.start()
t2.start()

t1.join()
t2.join()

print(counter)`,
      expectedOutput: '200000',
      numberOfBugs: 2,
    },
  }

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = authService.getUser()
    setUser(currentUser)

    const fetchChallenge = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/bug-fixing-challenge/${challengeId}`,
        )

        if (response.ok) {
          const bugFixingData: BugFixingChallengeData = await response.json()
          const challengeInfo = hardcodedChallenges[parseInt(challengeId)]

          const combinedChallenge: BugChallenge = {
            challenge_id: bugFixingData.challenge_id,
            title: challengeInfo?.title || 'Bug Fixing Challenge',
            description: challengeInfo?.description || '',
            difficulty: challengeInfo?.difficulty || 'Easy',
            buggyCode: bugFixingData.buggy_code,
            expectedOutput: bugFixingData.expected_output || '',
            numberOfBugs: bugFixingData.number_of_bugs,
          }

          setChallenge(combinedChallenge)
          setCode(bugFixingData.buggy_code)
        } else {
          const fallbackChallenge = hardcodedChallenges[parseInt(challengeId)]
          setChallenge(fallbackChallenge)
          if (fallbackChallenge) {
            setCode(fallbackChallenge.buggyCode)
          }
        }
      } catch (error) {
        const fallbackChallenge = hardcodedChallenges[parseInt(challengeId)]
        setChallenge(fallbackChallenge)
        if (fallbackChallenge) {
          setCode(fallbackChallenge.buggyCode)
        }
      }

      setLoading(false)
    }

    fetchChallenge()
  }, [router, challengeId, API_BASE_URL])

  if (loading) {
    return <Loading />
  }

  const handleSubmit = async () => {
    if (!runResult || !runResult.stdout) {
      setSubmissionMessage({
        type: 'error',
        message: 'Please run your code first to test it',
      })
      return
    }

    const normalizeOutput = (output: string) =>
      output.trim().toLowerCase().replace(/\s+/g, ' ')
    const actualOutput = normalizeOutput(runResult.stdout)
    const expectedOutput = normalizeOutput(challenge?.expectedOutput || '')

    if (actualOutput === expectedOutput) {
      try {
        const userId = authService.getDbUserId()
        const portfolioId = authService.getPortfolioId()

        if (!userId || !challenge) {
          setSubmissionMessage({
            type: 'error',
            message: 'Unable to submit: User or challenge data missing',
          })
          return
        }

        const submissionResponse = await fetch(
          `${API_BASE_URL}/user-submissions`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: userId,
              challenge_id: challenge.challenge_id,
              code_content: code,
              language: language,
              score: 100,
              execution_time: 0,
              memory_used: 0,
            }),
          },
        )

        if (
          submissionResponse.status >= 200 &&
          submissionResponse.status < 300
        ) {
          setSubmitted(true)
          setSubmissionMessage({
            type: 'success',
            message: '✓ Solution accepted! Great job!',
          })

          if (portfolioId) {
            await fetch(
              `${API_BASE_URL}/portfolio/${portfolioId}/increment-solved`,
              {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ increment: 1 }),
              },
            )
          }
        } else {
          setSubmissionMessage({
            type: 'error',
            message: 'Error saving submission',
          })
        }
      } catch (error) {
        setSubmissionMessage({
          type: 'error',
          message:
            'Error: ' +
            (error instanceof Error ? error.message : 'Unknown error'),
        })
      }
    } else {
      setSubmissionMessage({
        type: 'error',
        message: `Output does not match!\n\nExpected: ${challenge?.expectedOutput}\nGot: ${runResult.stdout}`,
      })
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-[#0a0e27] via-[#0d1117] to-[#0a0e27] text-white">
      <Navbar />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left - Problem Description */}
        <div className="w-1/2 border-r border-zinc-800 overflow-y-auto p-8">
          <div className="max-w-2xl">
            {/* Challenge Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                  challenge.difficulty === 'Easy'
                    ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                    : challenge.difficulty === 'Medium'
                      ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50'
                      : 'bg-red-900/30 text-red-400 border border-red-700/50'
                }`}
              >
                {challenge.difficulty}
              </span>
            </div>

            {/* Problem Statement */}
            <div className="mb-6">
              <h3 className="text-white font-bold mb-3">Problem Statement</h3>
              <p className="text-zinc-300 leading-relaxed">
                {challenge.description}
              </p>
            </div>

            {/* Number of Bugs */}
            {challenge.numberOfBugs && (
              <div className="mb-6">
                <h3 className="text-white font-bold mb-3">Number of Bugs</h3>
                <p className="text-zinc-300 text-sm">
                  There are{' '}
                  <span className="text-yellow-400 font-bold">
                    {challenge.numberOfBugs}
                  </span>{' '}
                  bug(s) in the code.
                </p>
              </div>
            )}

            {/* Buggy Code Snippet */}
            <div className="mb-6">
              <h3 className="text-white font-bold mb-3">Buggy Code Snippet</h3>
              <div className="bg-blue-950/30 border border-blue-900/50 rounded p-4 overflow-x-auto">
                <pre className="text-sm text-zinc-300 font-mono">
                  <code>{challenge.buggyCode}</code>
                </pre>
              </div>
            </div>

            {/* Expected Output */}
            <div className="mb-6">
              <h3 className="text-white font-bold mb-3">Expected Output</h3>
              <div className="bg-green-950/30 border border-green-900/50 rounded p-4">
                <p className="text-sm text-green-300 font-mono">
                  {challenge.expectedOutput}
                </p>
              </div>
            </div>

            {/* Hint */}
            {challenge.hint && (
              <div className="mb-6">
                <h3 className="text-white font-bold mb-3">Hint</h3>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded p-3">
                  <p className="text-zinc-300 text-sm">{challenge.hint}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Code Editor */}
        <div className="w-1/2 border-l border-zinc-800 overflow-hidden flex flex-col">
          {/* Top Header with Language and Collaborators */}
          <div className="bg-zinc-900/50 border-b border-zinc-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => {
                  const next = e.target.value as LanguageValue
                  setLanguage(next)
                  const preset =
                    LANGUAGE_PRESETS.find((p) => p.value === next) ??
                    LANGUAGE_PRESETS[0]
                  setCode(preset.template)
                  setRunResult(null)
                  setRunError(null)
                }}
                className="bg-zinc-800 text-white text-sm font-medium focus:outline-none px-3 py-1 rounded cursor-pointer"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="go">Go</option>
              </select>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-zinc-500 text-xs">
                  2 collaborators online
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  const preset = languagePreset ?? LANGUAGE_PRESETS[0]
                  setIsRunning(true)
                  setRunError(null)
                  setRunResult(null)
                  try {
                    const res = await compilerService.runCode({
                      languageId: preset.judge0Id,
                      sourceCode: code,
                    })
                    setRunResult(res)
                  } catch (err) {
                    setRunError(
                      err instanceof Error ? err.message : String(err),
                    )
                  } finally {
                    setIsRunning(false)
                  }
                }}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors text-sm flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 text-zinc-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M14 2v12l8-6z" />
                </svg>
                Run
              </button>

              <div className="w-px h-6 bg-zinc-800 mx-1" />
              <button className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors">
                <svg
                  className="w-4 h-4 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors">
                <svg
                  className="w-4 h-4 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden flex flex-col bg-blue-950/30 border-blue-900/50 m-4 rounded">
            <div className="flex flex-1 overflow-hidden">
              {/* Line Numbers */}
              <div className="bg-blue-950/20 border-r border-blue-900/50 px-4 py-6 text-right text-zinc-500 font-mono text-sm overflow-hidden select-none">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>
              {/* Code Area */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-blue-950/30 text-white font-mono text-sm p-6 resize-none focus:outline-none overflow-auto"
                style={{ lineHeight: '1.5' }}
              />
            </div>
          </div>

          {/* Output area */}
          {submissionMessage && (
            <div
              className={`border-b border-zinc-800 px-6 py-3 ${
                submissionMessage.type === 'success'
                  ? 'bg-green-950/30 border-green-900/50'
                  : 'bg-red-950/30 border-red-900/50'
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  submissionMessage.type === 'success'
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {submissionMessage.message}
              </p>
            </div>
          )}
          <div className="border-t border-zinc-800 px-6 py-3 max-h-36 overflow-auto">
            <h4 className="text-white font-bold text-sm mb-2">Compiler</h4>
            <div className="bg-zinc-900/40 p-3 rounded text-xs font-mono text-zinc-200 max-h-28 overflow-auto">
              {isRunning ? (
                <div>Running...</div>
              ) : runError ? (
                <div className="text-amber-300">{runError}</div>
              ) : runResult ? (
                <div>
                  {runResult.compile_output ? (
                    <pre className="whitespace-pre-wrap">
                      {runResult.compile_output}
                    </pre>
                  ) : (
                    <>
                      <div className="text-zinc-300">Stdout:</div>
                      <pre className="text-sm text-zinc-200">
                        {runResult.stdout ?? ''}
                      </pre>
                      {runResult.stderr && (
                        <>
                          <div className="text-orange-300">Stderr:</div>
                          <pre className="text-sm text-orange-300">
                            {runResult.stderr}
                          </pre>
                        </>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="text-zinc-400 text-xs">
                  Run your code to view compiler output here.
                </div>
              )}
            </div>
          </div>

          {/* Difference Viewer - REMOVED */}

          {/* Action Buttons */}
          <div className="border-t border-zinc-800 px-6 py-3 flex gap-4 justify-end items-center">
            <button
              onClick={async () => {
                const preset = languagePreset ?? LANGUAGE_PRESETS[0]
                setIsRunning(true)
                setRunError(null)
                setRunResult(null)
                try {
                  const res = await compilerService.runCode({
                    languageId: preset.judge0Id,
                    sourceCode: code,
                  })
                  setRunResult(res)

                  // Check if output matches expected
                  if (res.stdout) {
                    const normalizeOutput = (output: string) =>
                      output.trim().toLowerCase().replace(/\s+/g, ' ')
                    const actualOutput = normalizeOutput(res.stdout)
                    const expectedOutput = normalizeOutput(
                      challenge?.expectedOutput || '',
                    )

                    if (actualOutput === expectedOutput) {
                      setMatchPercentage(100)
                    } else {
                      setMatchPercentage(0)
                    }
                  }
                } catch (err) {
                  setRunError(err instanceof Error ? err.message : String(err))
                  setMatchPercentage(0)
                } finally {
                  setIsRunning(false)
                }
              }}
              disabled={isRunning}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              {isRunning ? 'Running...' : 'Run Code'}
            </button>

            {/* Match Percentage Display */}
            {runResult && (
              <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded text-sm">
                <span className="text-zinc-400">Match:</span>
                <span
                  className={`font-bold ${
                    matchPercentage === 100 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {matchPercentage}%
                </span>
                {matchPercentage === 100 && (
                  <span className="text-green-400 text-xs">✓</span>
                )}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitted || matchPercentage !== 100}
              className={`flex items-center gap-2 px-4 py-2 font-bold rounded text-sm transition-colors ${
                submitted
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : matchPercentage === 100
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-zinc-700 cursor-not-allowed text-zinc-400'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              {submitted ? 'SUBMITTED ✓' : 'Submit Solution'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
