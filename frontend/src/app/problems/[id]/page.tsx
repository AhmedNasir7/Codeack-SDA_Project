'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { authService } from '@/lib/authService'
import Navbar from '@/components/Navbar'
import { compilerService, RunCodeResponse } from '@/lib/compilerService'
import Loading from '@/components/Loading'

interface Problem {
  id: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  acceptance: number
  category: string
  solved: boolean
  description: string
  testCases?: Array<{ input: string; expected: string }>
}

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
    template: `def two_sum(nums, target):
    # Write code here
    pass


if __name__ == "__main__":
    # Test cases
    print(two_sum([2, 7, 11, 15], 9))  # Expected: [0, 1]
    print(two_sum([3, 2, 4], 6))       # Expected: [1, 2]
    print(two_sum([3, 3], 6))          # Expected: [0, 1]`,
  },
  {
    value: 'javascript',
    label: 'JavaScript',
    judge0Id: 63,
    template: `function twoSum(nums, target) {
  // Write code here
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9));  // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6));       // Expected: [1, 2]
console.log(twoSum([3, 3], 6));          // Expected: [0, 1]`,
  },
  {
    value: 'cpp',
    label: 'C++',
    judge0Id: 54,
    template: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    auto res = twoSum(nums, target);
    cout << "[" << res[0] << "," << res[1] << "]" << endl;
    return 0;
}`,
  },
  {
    value: 'java',
    label: 'Java',
    judge0Id: 62,
    template: `import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        System.out.println(Arrays.toString(twoSum(nums, target)));
    }
}`,
  },
  {
    value: 'go',
    label: 'Go',
    judge0Id: 60,
    template: `package main

import "fmt"

func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if idx, ok := seen[complement]; ok {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return []int{}
}

func main() {
    nums := []int{2, 7, 11, 15}
    target := 9
    fmt.Println(twoSum(nums, target))
}`,
  },
]

export default function ProblemSolverPage() {
  const router = useRouter()
  const params = useParams()
  const problemId = params.id as string
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<LanguageValue>(
    LANGUAGE_PRESETS[0].value,
  )
  const [code, setCode] = useState(LANGUAGE_PRESETS[0].template)
  const [activeTab, setActiveTab] = useState<'testcases' | 'output'>(
    'testcases',
  )
  const [isRunning, setIsRunning] = useState(false)
  const [runResult, setRunResult] = useState<RunCodeResponse | null>(null)
  const [runError, setRunError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Array<{
    passed: boolean
    input: string
    expected: string
    actual: string
  }> | null>(null)
  const [submissionResults, setSubmissionResults] = useState<Array<{
    passed: boolean
    input: string
    expected: string
    actual: string
  }> | null>(null)
  const [submissionModal, setSubmissionModal] = useState(false)
  const [problem, setProblem] = useState<Problem | null>(null)

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = authService.getUser()
    setUser(currentUser)

    const fetchProblem = async () => {
      try {
        // Fetch problem details
        const problemResponse = await fetch(
          `${API_BASE_URL}/challenge/${problemId}`,
        )
        if (!problemResponse.ok) {
          setLoading(false)
          return
        }

        const problemData = await problemResponse.json()

        // Fetch test cases for this problem (no database needed, in-memory)
        let testCasesData = []
        try {
          const testCasesResponse = await fetch(
            `${API_BASE_URL}/test-case/challenge/${problemId}`,
          )
          if (testCasesResponse.ok) {
            testCasesData = await testCasesResponse.json()
          }
        } catch (testCaseError) {
          console.warn('Could not fetch test cases:', testCaseError)
          // Test cases are optional, so we continue without them
        }

        // Map test cases to the Problem format
        const mappedTestCases = testCasesData.map((tc: any) => ({
          input: tc.input,
          expected: tc.expected_output,
        }))

        const mappedProblem: Problem = {
          id: problemData.challenge_id,
          title: problemData.title,
          difficulty: problemData.difficulty,
          acceptance: 50,
          category: 'Algorithm',
          solved: false,
          description: problemData.description,
          testCases: mappedTestCases,
        }
        setProblem(mappedProblem)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching problem:', error)
        setLoading(false)
      }
    }

    fetchProblem()
  }, [router, problemId])
  const languagePreset = useMemo(
    () => LANGUAGE_PRESETS.find((preset) => preset.value === language),
    [language],
  )
  const codeLines = useMemo(() => {
    const lines = (code || '').split('\n')
    return lines.length ? lines : ['']
  }, [code])

  const handleLanguageChange = (nextLanguage: LanguageValue) => {
    setLanguage(nextLanguage)
    const preset =
      LANGUAGE_PRESETS.find((option) => option.value === nextLanguage) ??
      LANGUAGE_PRESETS[0]
    setCode(preset.template)
    setRunResult(null)
    setRunError(null)
  }

  // Helper function to validate Two Sum answers (accepts any valid pair)
  const validateTwoSum = (
    result: any,
    expectedStr: string,
    nums: number[],
    target: number,
  ): boolean => {
    try {
      // If result is not an array with 2 elements, it's invalid
      if (!Array.isArray(result) || result.length !== 2) {
        return false
      }

      const [i, j] = result

      // Both must be integers
      if (!Number.isInteger(i) || !Number.isInteger(j)) {
        return false
      }

      // Both indices must be valid and different
      if (
        !(i >= 0 && j >= 0 && i < nums.length && j < nums.length && i !== j)
      ) {
        return false
      }

      // Check if the two numbers sum to target
      return nums[i] + nums[j] === target
    } catch (err) {
      return false
    }
  }

  const handleRunCode = async () => {
    if (!languagePreset || !problem) return

    setIsRunning(true)
    setActiveTab('testcases')
    setRunError(null)

    try {
      const response = await compilerService.runCode({
        languageId: languagePreset.judge0Id,
        sourceCode: code,
      })
      setRunResult(response)

      // Also run test cases automatically and show in testcases tab
      if (problem.testCases) {
        if (languagePreset.value === 'javascript') {
          const results: typeof testResults = []
          for (const testCase of problem.testCases) {
            try {
              // Parse test case input: "[2,7,11,15], 9"
              const [numsStr, targetStr] = testCase.input.split('], ')
              const nums = JSON.parse(numsStr + ']')
              const target = parseInt(targetStr)

              console.log('Test Case:', testCase.input)
              console.log('Parsed nums:', nums, 'target:', target)
              console.log('Code being executed:', code)

              // Execute the user's code in a function scope and extract the twoSum function
              const func = new Function(code + '; return twoSum;')()

              if (!func || typeof func !== 'function') {
                console.log('Function not found or not a function')
                results.push({
                  passed: false,
                  input: testCase.input,
                  expected: testCase.expected,
                  actual: 'Function not found',
                })
                continue
              }

              // Call the function with test inputs
              let actual = func(nums, target)

              console.log('Actual result:', actual)
              console.log('Expected:', testCase.expected)

              // Ensure actual is an array
              if (!Array.isArray(actual)) {
                actual = null
              }

              const actualStr = JSON.stringify(actual)

              // Validate if the result is correct
              const passed = validateTwoSum(
                actual,
                testCase.expected,
                nums,
                target,
              )

              console.log('Passed:', passed)

              results.push({
                passed,
                input: testCase.input,
                expected: testCase.expected,
                actual: actualStr,
              })
            } catch (err) {
              results.push({
                passed: false,
                input: testCase.input,
                expected: testCase.expected,
                actual: `Error: ${err instanceof Error ? err.message : 'Execution failed'}`,
              })
            }
          }
          setTestResults(results)
        } else {
          // For all other languages (Python, C++, Java, Go) - use Judge0
          const results: typeof testResults = []
          for (const testCase of problem.testCases) {
            try {
              // Parse input
              const [numsStr, targetStr] = testCase.input.split('], ')
              const nums = JSON.parse(numsStr + ']')
              const target = parseInt(targetStr)

              let testCode = code
              let testResponse

              if (languagePreset.value === 'python') {
                // Remove the main block for Python
                const cleanCode = code.replace(
                  /\nif __name__ == "__main__":[^\n]*\n[\s\S]*/,
                  '',
                )
                testCode =
                  cleanCode +
                  `\n\nimport json\nresult = two_sum(${JSON.stringify(nums)}, ${target})\nprint(json.dumps(result))`
              } else if (languagePreset.value === 'cpp') {
                // For C++, replace the existing main() function
                testCode = code.replace(
                  /int main\(\) \{[\s\S]*?\n\}/,
                  `int main() {\n  vector<int> nums = {${nums.join(', ')}};\n  int target = ${target};\n  auto res = twoSum(nums, target);\n  std::cout << "[" << res[0] << "," << res[1] << "]" << std::endl;\n  return 0;\n}`,
                )
              } else if (languagePreset.value === 'java') {
                // For Java, replace main method test
                testCode = code.replace(
                  /public static void main\(String\[\] args\) \{[\s\S]*?\n    \}/,
                  `public static void main(String[] args) {
        int[] nums = {${nums.join(', ')}};
        int target = ${target};
        System.out.println(Arrays.toString(twoSum(nums, target)));
    }`,
                )
              } else if (languagePreset.value === 'go') {
                // For Go, replace main function test
                testCode = code.replace(
                  /func main\(\) \{[\s\S]*?\}/,
                  `func main() {
    nums := []int{${nums.join(', ')}}
    target := ${target}
    fmt.Println(twoSum(nums, target))
}`,
                )
              }

              testResponse = await compilerService.runCode({
                languageId: languagePreset.judge0Id,
                sourceCode: testCode,
              })

              const actualOutput = (testResponse.stdout || '').trim()

              // Parse the output to get the actual result
              let actual = null
              try {
                actual = JSON.parse(actualOutput)
              } catch (e) {
                actual = null
              }

              // Validate using the same logic
              const passed = validateTwoSum(
                actual,
                testCase.expected,
                nums,
                target,
              )

              results.push({
                passed,
                input: testCase.input,
                expected: testCase.expected,
                actual: actualOutput || testResponse.stderr || 'No output',
              })
            } catch (err) {
              results.push({
                passed: false,
                input: testCase.input,
                expected: testCase.expected,
                actual: `Error: ${err instanceof Error ? err.message : 'Execution failed'}`,
              })
            }
          }
          setTestResults(results)
        }
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to reach the compiler right now.'
      setRunError(message)
      setRunResult(null)
    } finally {
      setIsRunning(false)
    }
  }

  const saveSubmissionToDatabase = async (
    results: Array<{
      passed: boolean
      input: string
      expected: string
      actual: string
    }>,
  ) => {
    try {
      const userId = authService.getDbUserId()
      const portfolioId = authService.getPortfolioId()

      if (!userId) {
        return
      }

      if (!problem) {
        return
      }

      // Save user submission
      const userSubmissionResponse = await fetch(
        `${API_BASE_URL}/user-submissions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            challenge_id: problem.id,
            code_content: code,
            language: languagePreset?.value || 'javascript',
            score: results.every((r) => r.passed) ? 100 : 0,
            execution_time: 0,
            memory_used: 0,
          }),
        },
      )

      let responseData
      try {
        responseData = await userSubmissionResponse.json()
      } catch (parseError) {
        responseData = null
      }

      // Consider both 200-299 status codes as success
      if (
        userSubmissionResponse.status >= 200 &&
        userSubmissionResponse.status < 300
      ) {
        // Update portfolio - increment solved count
        if (portfolioId) {
          const portfolioResponse = await fetch(
            `${API_BASE_URL}/portfolio/${portfolioId}/increment-solved`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ increment: 1 }),
            },
          )

          const portfolioData = await portfolioResponse.json()
          if (!portfolioResponse.ok) {
            // Portfolio update failed, but submission was saved
          }
        }
      }
    } catch (error) {
      // Error saving submission
    }
  }

  const handleSubmit = async () => {
    if (!languagePreset || !problem || !problem.testCases) return

    setIsRunning(true)
    setRunError(null)
    setSubmissionResults(null)
    setSubmissionModal(true)

    try {
      if (languagePreset.value === 'javascript') {
        const results: typeof submissionResults = []
        for (const testCase of problem.testCases) {
          try {
            // Parse test case input: "[2,7,11,15], 9"
            const [numsStr, targetStr] = testCase.input.split('], ')
            const nums = JSON.parse(numsStr + ']')
            const target = parseInt(targetStr)

            // Execute the user's code in a function scope and extract the twoSum function
            const func = new Function(code + '; return twoSum;')()

            if (!func || typeof func !== 'function') {
              results.push({
                passed: false,
                input: testCase.input,
                expected: testCase.expected,
                actual: 'Function not found',
              })
              continue
            }

            // Call the function with test inputs
            let actual = func(nums, target)

            if (!Array.isArray(actual)) {
              actual = null
            }

            const actualStr = JSON.stringify(actual)

            const passed = validateTwoSum(
              actual,
              testCase.expected,
              nums,
              target,
            )

            results.push({
              passed,
              input: testCase.input,
              expected: testCase.expected,
              actual: actualStr,
            })
          } catch (err) {
            results.push({
              passed: false,
              input: testCase.input,
              expected: testCase.expected,
              actual: `Error: ${err instanceof Error ? err.message : 'Execution failed'}`,
            })
          }
        }
        setSubmissionResults(results)

        // If all tests passed, save to database
        if (results.every((r) => r.passed)) {
          await saveSubmissionToDatabase(results)
        }
      } else {
        // For all other languages (Python, C++, Java, Go) - use Judge0
        const results: typeof submissionResults = []
        for (const testCase of problem.testCases) {
          try {
            const [numsStr, targetStr] = testCase.input.split('], ')
            const nums = JSON.parse(numsStr + ']')
            const target = parseInt(targetStr)

            let testCode = code
            let testResponse

            if (languagePreset.value === 'python') {
              const cleanCode = code.replace(
                /\nif __name__ == "__main__":[^\n]*\n[\s\S]*/,
                '',
              )
              testCode =
                cleanCode +
                `\n\nimport json\nresult = two_sum(${JSON.stringify(nums)}, ${target})\nprint(json.dumps(result))`
            } else if (languagePreset.value === 'cpp') {
              // For C++, replace the existing main() function
              testCode = code.replace(
                /int main\(\) \{[\s\S]*?\n\}/,
                `int main() {\n  vector<int> nums = {${nums.join(', ')}};\n  int target = ${target};\n  auto res = twoSum(nums, target);\n  std::cout << "[" << res[0] << "," << res[1] << "]" << std::endl;\n  return 0;\n}`,
              )
            } else if (languagePreset.value === 'java') {
              testCode = code.replace(
                /public static void main\(String\[\] args\) \{[\s\S]*?\n    \}/,
                `public static void main(String[] args) {
        int[] nums = {${nums.join(', ')}};
        int target = ${target};
        System.out.println(Arrays.toString(twoSum(nums, target)));
    }`,
              )
            } else if (languagePreset.value === 'go') {
              testCode = code.replace(
                /func main\(\) \{[\s\S]*?\}/,
                `func main() {
    nums := []int{${nums.join(', ')}}
    target := ${target}
    fmt.Println(twoSum(nums, target))
}`,
              )
            }

            testResponse = await compilerService.runCode({
              languageId: languagePreset.judge0Id,
              sourceCode: testCode,
            })

            const actualOutput = (testResponse.stdout || '').trim()

            let actual = null
            try {
              actual = JSON.parse(actualOutput)
            } catch (e) {
              actual = null
            }

            const passed = validateTwoSum(
              actual,
              testCase.expected,
              nums,
              target,
            )

            results.push({
              passed,
              input: testCase.input,
              expected: testCase.expected,
              actual: actualOutput || testResponse.stderr || 'No output',
            })
          } catch (err) {
            results.push({
              passed: false,
              input: testCase.input,
              expected: testCase.expected,
              actual: `Error: ${err instanceof Error ? err.message : 'Execution failed'}`,
            })
          }
        }
        setSubmissionResults(results)

        // If all tests passed, save to database
        if (results.every((r) => r.passed)) {
          await saveSubmissionToDatabase(results)
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Submission failed'
      setRunError(message)
    } finally {
      setIsRunning(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (!problem) {
    return (
      <main className="min-h-screen bg-linear-to-b from-[#0a0e27] via-[#0d1117] to-[#0a0e27] text-white">
        <Navbar />
        <section className="px-6 py-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-bold">Problem not found</h1>
            <button
              onClick={() => router.back()}
              className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-[#0a0e27] via-[#0d1117] to-[#0a0e27] text-white">
      <Navbar />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Container - Problem Description */}
        <div className="w-1/2 border-r border-zinc-800 overflow-y-auto p-8">
          <div className="max-w-2xl">
            {/* Problem Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
              <p className="text-zinc-300 leading-relaxed mb-6">
                {problem.description}
              </p>
            </div>

            {/* Difficulty and Category */}
            <div className="mb-8 flex gap-4">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Difficulty:</span>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    problem.difficulty === 'Easy'
                      ? 'bg-green-900/30 text-green-400'
                      : problem.difficulty === 'Medium'
                        ? 'bg-yellow-900/30 text-yellow-400'
                        : 'bg-red-900/30 text-red-400'
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Category:</span>
                <span className="px-3 py-1 rounded text-sm font-medium bg-blue-900/30 text-blue-400">
                  {problem.category}
                </span>
              </div>
            </div>

            {/* Acceptance Rate */}
            <div className="mb-8 p-4 bg-zinc-800/50 rounded border border-zinc-700">
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Acceptance Rate:</span>
                <span className="text-lg font-bold text-blue-400">
                  {problem.acceptance}%
                </span>
              </div>
            </div>

            {/* Test Cases (if available) */}
            {problem.testCases && problem.testCases.length > 0 && (
              <div>
                <h3 className="text-white font-bold mb-4">
                  Sample Test Cases ({problem.testCases.length}):
                </h3>
                <div className="space-y-4">
                  {problem.testCases.map((testCase, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-950/30 border border-blue-900/50 rounded p-4"
                    >
                      <p className="text-sm mb-2">
                        <span className="text-blue-400 font-bold">
                          Example {idx + 1}:
                        </span>
                      </p>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-blue-400">Input:</span>{' '}
                          <span className="text-zinc-300">
                            {testCase.input}
                          </span>
                        </p>
                        <p>
                          <span className="text-blue-400">Output:</span>{' '}
                          <span className="text-zinc-300">
                            {testCase.expected}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Container - Code Editor */}
        <div className="w-1/2 border-l border-zinc-800 overflow-hidden flex flex-col">
          {/* Top Header with Language and Collaborators */}
          <div className="bg-zinc-900/50 border-b border-zinc-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) =>
                  handleLanguageChange(e.target.value as LanguageValue)
                }
                className="bg-zinc-800 text-white text-sm font-medium focus:outline-none px-3 py-1 rounded cursor-pointer"
              >
                {LANGUAGE_PRESETS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-zinc-500 text-xs">2 users online</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
                {codeLines.map((_, i) => (
                  <div key={`line-${i}`} className="leading-6">
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

          {/* Tabs - Test Cases, Output, Submissions */}
          <div className="border-t border-zinc-800 px-8 py-4 flex gap-8">
            <button
              className={`pb-2 font-medium text-sm transition-colors ${
                activeTab === 'testcases'
                  ? 'text-blue-400 border-b-2 border-blue-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('testcases')}
            >
              Test Cases
            </button>
            <button
              className={`pb-2 font-medium text-sm transition-colors ${
                activeTab === 'output'
                  ? 'text-blue-400 border-b-2 border-blue-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('output')}
            >
              Output
            </button>
          </div>

          {/* Test Case Result */}
          <div className="border-t border-zinc-800 px-6 py-3 max-h-40 overflow-auto flex flex-col">
            {activeTab === 'testcases' ? (
              <>
                {testResults ? (
                  <div className="space-y-3">
                    {/* Summary */}
                    {testResults.length > 0 && (
                      <div className="mb-4 p-3 rounded border border-zinc-700 bg-zinc-800/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-300">
                            Test Results:
                          </span>
                          <span className="text-sm font-bold">
                            <span className="text-green-400">
                              {testResults.filter((r) => r.passed).length}{' '}
                              passed
                            </span>
                            {' / '}
                            <span className="text-red-400">
                              {testResults.filter((r) => !r.passed).length}{' '}
                              failed
                            </span>
                            {' / '}
                            <span className="text-zinc-400">
                              {testResults.length} total
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                    {testResults.map((result, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-white font-bold text-sm">
                            Test Case {idx + 1}
                          </h4>
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded ${
                              result.passed
                                ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                                : 'bg-red-900/30 text-red-400 border border-red-700/50'
                            }`}
                          >
                            {result.passed ? '✓ PASSED' : '✗ FAILED'}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-zinc-300 bg-blue-950/30 border border-blue-900/50 rounded p-2">
                          <p>
                            <span className="text-blue-400">Input: </span>
                            {result.input}
                          </p>
                          <p>
                            <span className="text-blue-400">Expected: </span>
                            {result.expected}
                          </p>
                          <p>
                            <span className="text-blue-400">Actual: </span>
                            <span
                              className={
                                result.passed
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              }
                            >
                              {result.actual}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="mb-2 text-xs text-zinc-400">
                      Click "Run Code" to see test results
                    </div>
                    {problem.testCases && problem.testCases.length > 0 ? (
                      <div className="space-y-3">
                        {problem.testCases.map((testCase, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-bold text-sm">
                                Test Case {idx + 1}
                              </h4>
                              <span className="text-zinc-500 text-xs bg-zinc-800 px-2 py-1 rounded">
                                Reference
                              </span>
                            </div>
                            <div className="space-y-2 text-xs text-zinc-300 bg-blue-950/30 border border-blue-900/50 rounded p-3">
                              <p>
                                <span className="text-blue-400">Input: </span>
                                {testCase.input}
                              </p>
                              <p>
                                <span className="text-blue-400">
                                  Expected:{' '}
                                </span>
                                {testCase.expected}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs text-zinc-300 bg-blue-950/30 border border-blue-900/50 rounded p-3 flex-1">
                        <p>
                          <span className="text-blue-400">Input: </span>
                          nums = [2,7,11,15], target = 9
                        </p>
                        <p>
                          <span className="text-blue-400">Expected: </span>
                          [0,1]
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="space-y-3 text-xs text-zinc-300 bg-blue-950/30 border border-blue-900/50 rounded p-3 flex-1">
                {runError && <p className="text-red-400 text-sm">{runError}</p>}
                {!runError && !runResult && (
                  <p className="text-zinc-400 text-sm">
                    Run your code to view compiler output here.
                  </p>
                )}
                {runResult?.stdout && (
                  <div>
                    <p className="text-blue-400 mb-1">STDOUT:</p>
                    <pre className="whitespace-pre-wrap font-mono bg-black/30 rounded p-2 text-white">
                      {runResult.stdout}
                    </pre>
                  </div>
                )}
                {runResult?.stderr && (
                  <div>
                    <p className="text-blue-400 mb-1">STDERR:</p>
                    <pre className="whitespace-pre-wrap font-mono bg-black/30 rounded p-2 text-red-400">
                      {runResult.stderr}
                    </pre>
                  </div>
                )}
                {runResult?.compile_output && (
                  <div>
                    <p className="text-blue-400 mb-1">Compiler:</p>
                    <pre className="whitespace-pre-wrap font-mono bg-black/30 rounded p-2 text-yellow-400">
                      {runResult.compile_output}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-zinc-800 px-6 py-3 flex gap-4 justify-end items-center">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-sm transition-colors disabled:opacity-60"
              onClick={handleRunCode}
              disabled={isRunning}
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
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-sm transition-colors disabled:opacity-60"
              onClick={handleSubmit}
              disabled={isRunning}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              Submit
            </button>
          </div>

          {/* Submission Modal */}
          {submissionModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 max-w-2xl w-full max-h-96 overflow-y-auto">
                <div className="sticky top-0 bg-zinc-800 border-b border-zinc-700 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">
                    Submission Results
                  </h2>
                  <button
                    onClick={() => setSubmissionModal(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6">
                  {submissionResults ? (
                    <>
                      {/* Summary */}
                      <div className="mb-4 p-4 rounded border border-zinc-700 bg-zinc-800/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-zinc-300">
                            Overall Result:
                          </span>
                          <span
                            className={`font-bold text-sm ${
                              submissionResults.every((r) => r.passed)
                                ? 'text-green-400'
                                : 'text-red-400'
                            }`}
                          >
                            {submissionResults.every((r) => r.passed)
                              ? '✓ Solution Accepted'
                              : '✗ Solution Failed'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-300">
                            Test Results:
                          </span>
                          <span className="text-sm font-bold">
                            <span className="text-green-400">
                              {submissionResults.filter((r) => r.passed).length}{' '}
                              passed
                            </span>
                            {' / '}
                            <span className="text-red-400">
                              {
                                submissionResults.filter((r) => !r.passed)
                                  .length
                              }{' '}
                              failed
                            </span>
                            {' / '}
                            <span className="text-zinc-400">
                              {submissionResults.length} total
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Detailed Results */}
                      <div className="space-y-3">
                        {submissionResults.map((result, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-bold text-sm">
                                Test Case {idx + 1}
                              </h4>
                              <span
                                className={`text-xs font-bold px-2 py-1 rounded ${
                                  result.passed
                                    ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                                    : 'bg-red-900/30 text-red-400 border border-red-700/50'
                                }`}
                              >
                                {result.passed ? '✓ PASSED' : '✗ FAILED'}
                              </span>
                            </div>
                            <div className="space-y-1 text-xs text-zinc-300 bg-blue-950/30 border border-blue-900/50 rounded p-2">
                              <p>
                                <span className="text-blue-400">Input: </span>
                                {result.input}
                              </p>
                              <p>
                                <span className="text-blue-400">
                                  Expected:{' '}
                                </span>
                                {result.expected}
                              </p>
                              <p>
                                <span className="text-blue-400">Actual: </span>
                                <span
                                  className={
                                    result.passed
                                      ? 'text-green-400'
                                      : 'text-red-400'
                                  }
                                >
                                  {result.actual}
                                </span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-zinc-400">Processing submission...</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
