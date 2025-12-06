'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { authService } from '@/lib/authService'
import Navbar from '@/components/Navbar'
import {
  compilerService,
  RunCodeResponse,
} from '@/lib/compilerService'

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
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; input: string; expected: string; actual: string }> | null>(null)
  const [submissionResults, setSubmissionResults] = useState<Array<{ passed: boolean; input: string; expected: string; actual: string }> | null>(null)
  const [submissionModal, setSubmissionModal] = useState(false)

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = authService.getUser()
    setUser(currentUser)
    setLoading(false)
  }, [router])

  // Sample problems data
  const problemsData: { [key: string]: Problem } = {
    '1': {
      id: 1,
      title: 'Set Intersection Size At Least Two',
      difficulty: 'Hard',
      acceptance: 51.2,
      category: 'Array',
      solved: false,
      description:
        'Given an integer array nums of length n where all the integers of nums are from the range [1, n], find all the integers in the range [1, n] that do not appear in the array.',
    },
    '2': {
      id: 2,
      title: 'Two Sum',
      difficulty: 'Easy',
      acceptance: 56.8,
      category: 'Array',
      solved: true,
      description:
        'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.',
      testCases: [
        { input: '[2,7,11,15], 9', expected: '[0,1]' },
        { input: '[3,2,4], 6', expected: '[1,2]' },
        { input: '[3,3], 6', expected: '[0,1]' },
      ],
    },
    '3': {
      id: 3,
      title: 'Add Two Numbers',
      difficulty: 'Medium',
      acceptance: 47.2,
      category: 'Linked List',
      solved: false,
      description:
        'You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list.',
    },
  }

  const problem = problemsData[problemId]
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
  const validateTwoSum = (result: any, expectedStr: string, nums: number[], target: number): boolean => {
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
      if (!(i >= 0 && j >= 0 && i < nums.length && j < nums.length && i !== j)) {
        return false
      }
      
      // Check if the two numbers sum to target
      return nums[i] + nums[j] === target
    } catch (err) {
      return false
    }
  }

  const handleRunCode = async () => {
    if (!languagePreset) return

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
              // Create function that explicitly returns the result, ignoring any console.log
              const func = new Function(`
                ${code}
                return typeof twoSum !== 'undefined' ? twoSum : null
              `)()
              
              if (!func) {
                results.push({
                  passed: false,
                  input: testCase.input,
                  expected: testCase.expected,
                  actual: 'Function not found',
                })
                continue
              }

              const [numsStr, targetStr] = testCase.input.split('], ')
              const nums = JSON.parse(numsStr + ']')
              const target = parseInt(targetStr)
              
              // Call function and get result - should be a single array
              let actual = func(nums, target)
              
              // Ensure actual is an array (in case of double wrapping or other issues)
              if (!Array.isArray(actual)) {
                actual = null
              }
              
              const actualStr = JSON.stringify(actual)
              
              // Validate if the result is a valid answer (any valid pair that sums to target)
              const passed = validateTwoSum(actual, testCase.expected, nums, target)

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
        } else if (languagePreset.value === 'python') {
          const results: typeof testResults = []
          for (const testCase of problem.testCases) {
            try {
              // Parse input
              const [numsStr, targetStr] = testCase.input.split('], ')
              const nums = JSON.parse(numsStr + ']')
              const target = parseInt(targetStr)
              
              // Build Python code to call two_sum with parsed arguments
              // Remove the template's main block and just keep the function definition
              const cleanCode = code.replace(/\nif __name__ == "__main__":[^\n]*\n[\s\S]*/, '')
              const pythonCode = cleanCode + `\n\n# Test\nimport json\nresult = two_sum(${JSON.stringify(nums)}, ${target})\nprint(json.dumps(result))`
              const testResponse = await compilerService.runCode({
                languageId: languagePreset.judge0Id,
                sourceCode: pythonCode,
              })
              
              const actualOutput = (testResponse.stdout || '').trim()
              
              // Parse the output to get the actual result
              let actual = null
              try {
                actual = JSON.parse(actualOutput)
              } catch (e) {
                actual = null
              }
              
              // Validate using the same logic as JavaScript
              const passed = validateTwoSum(actual, testCase.expected, nums, target)
              
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

  const handleSubmit = async () => {
    if (!languagePreset || !problem.testCases) return

    setIsRunning(true)
    setRunError(null)
    setSubmissionResults(null)
    setSubmissionModal(true)

    try {
      if (languagePreset.value === 'javascript') {
        const results: typeof submissionResults = []
        for (const testCase of problem.testCases) {
          try {
            const func = new Function(`
              ${code}
              return typeof twoSum !== 'undefined' ? twoSum : null
            `)()
            
            if (!func) {
              results.push({
                passed: false,
                input: testCase.input,
                expected: testCase.expected,
                actual: 'Function not found',
              })
              continue
            }

            const [numsStr, targetStr] = testCase.input.split('], ')
            const nums = JSON.parse(numsStr + ']')
            const target = parseInt(targetStr)
            
            let actual = func(nums, target)
            
            // Ensure actual is an array (in case of double wrapping or other issues)
            if (!Array.isArray(actual)) {
              actual = null
            }
            
            const actualStr = JSON.stringify(actual)
            
            // Validate if the result is a valid answer (any valid pair that sums to target)
            const passed = validateTwoSum(actual, testCase.expected, nums, target)

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
      } else if (languagePreset.value === 'python') {
        const results: typeof submissionResults = []
        for (const testCase of problem.testCases) {
          try {
            // Parse input
            const [numsStr, targetStr] = testCase.input.split('], ')
            const nums = JSON.parse(numsStr + ']')
            const target = parseInt(targetStr)
            
            // Build Python code to call two_sum with parsed arguments
            // Remove the template's main block and just keep the function definition
            const cleanCode = code.replace(/\nif __name__ == "__main__":[^\n]*\n[\s\S]*/, '')
            const pythonCode = cleanCode + `\n\n# Test\nimport json\nresult = two_sum(${JSON.stringify(nums)}, ${target})\nprint(json.dumps(result))`
            const testResponse = await compilerService.runCode({
              languageId: languagePreset.judge0Id,
              sourceCode: pythonCode,
            })
            
            const actualOutput = (testResponse.stdout || '').trim()
            
            // Parse the output to get the actual result
            let actual = null
            try {
              actual = JSON.parse(actualOutput)
            } catch (e) {
              actual = null
            }
            
            // Validate using the same logic as JavaScript
            const passed = validateTwoSum(actual, testCase.expected, nums, target)
            
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
      } else {
        setRunError('Submission is currently only supported for JavaScript and Python')
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Submission failed'
      setRunError(message)
    } finally {
      setIsRunning(false)
    }
  }

  // Only show Two Sum problem, others show "not found"
  const isTwoSum = problemId === '2'

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

  if (!problem || !isTwoSum) {
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
                Given an array of integers{' '}
                <span className="text-blue-400">nums</span> and an integer{' '}
                <span className="text-blue-400">target</span>, return indices of
                the two numbers such that they add up to{' '}
                <span className="text-blue-400">target</span>.
              </p>
            </div>

            {/* Example 1 */}
            <div className="mb-8">
              <h3 className="text-white font-bold mb-3">Example 1:</h3>
              <div className="bg-blue-950/30 border border-blue-900/50 rounded p-4 space-y-2 text-sm">
                <p>
                  <span className="text-blue-400">Input:</span>{' '}
                  <span className="text-zinc-300">
                    nums = [2,7,11,15], target = 9
                  </span>
                </p>
                <p>
                  <span className="text-blue-400">Output:</span>{' '}
                  <span className="text-zinc-300">[0,1]</span>
                </p>
                <p>
                  <span className="text-blue-400">Explanation:</span>{' '}
                  <span className="text-zinc-300">
                    Because nums[0] + nums[1] == 9, we return [0, 1].
                  </span>
                </p>
              </div>
            </div>

            {/* Example 2 */}
            <div className="mb-8">
              <h3 className="text-white font-bold mb-3">Example 2:</h3>
              <div className="bg-blue-950/30 border border-blue-900/50 rounded p-4 space-y-2 text-sm">
                <p>
                  <span className="text-blue-400">Input:</span>{' '}
                  <span className="text-zinc-300">
                    nums = [3,2,4], target = 6
                  </span>
                </p>
                <p>
                  <span className="text-blue-400">Output:</span>{' '}
                  <span className="text-zinc-300">[1,2]</span>
                </p>
              </div>
            </div>

            {/* Constraints */}
            <div>
              <h3 className="text-white font-bold mb-4">Constraints:</h3>
              <ul className="text-zinc-300 space-y-2 text-sm">
                <li>• 2 ≤ nums.length ≤ 10⁴</li>
                <li>• -10⁹ ≤ nums[i] ≤ 10⁹</li>
                <li>• -10⁹ ≤ target ≤ 10⁹</li>
                <li>• Only one valid answer exists.</li>
              </ul>
            </div>
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
                <span className="text-zinc-500 text-xs">
                  2 users online
                </span>
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
                          <span className="text-sm text-zinc-300">Test Results:</span>
                          <span className="text-sm font-bold">
                            <span className="text-green-400">{testResults.filter(r => r.passed).length} passed</span>
                            {' / '}
                            <span className="text-red-400">{testResults.filter(r => !r.passed).length} failed</span>
                            {' / '}
                            <span className="text-zinc-400">{testResults.length} total</span>
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
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            result.passed 
                              ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                              : 'bg-red-900/30 text-red-400 border border-red-700/50'
                          }`}>
                            {result.passed ? '✓ PASSED' : '✗ FAILED'}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-zinc-300 bg-blue-950/30 border border-blue-900/50 rounded p-2">
                          <p><span className="text-blue-400">Input: </span>{result.input}</p>
                          <p><span className="text-blue-400">Expected: </span>{result.expected}</p>
                          <p><span className="text-blue-400">Actual: </span><span className={result.passed ? 'text-green-400' : 'text-red-400'}>{result.actual}</span></p>
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
                                <span className="text-blue-400">Expected: </span>
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
                {runError && (
                  <p className="text-red-400 text-sm">{runError}</p>
                )}
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
                  <h2 className="text-lg font-bold text-white">Submission Results</h2>
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
                          <span className="text-sm text-zinc-300">Overall Result:</span>
                          <span className={`font-bold text-sm ${
                            submissionResults.every(r => r.passed) ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {submissionResults.every(r => r.passed) ? '✓ Solution Accepted' : '✗ Solution Failed'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-300">Test Results:</span>
                          <span className="text-sm font-bold">
                            <span className="text-green-400">{submissionResults.filter(r => r.passed).length} passed</span>
                            {' / '}
                            <span className="text-red-400">{submissionResults.filter(r => !r.passed).length} failed</span>
                            {' / '}
                            <span className="text-zinc-400">{submissionResults.length} total</span>
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
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                result.passed 
                                  ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                                  : 'bg-red-900/30 text-red-400 border border-red-700/50'
                              }`}>
                                {result.passed ? '✓ PASSED' : '✗ FAILED'}
                              </span>
                            </div>
                            <div className="space-y-1 text-xs text-zinc-300 bg-blue-950/30 border border-blue-900/50 rounded p-2">
                              <p><span className="text-blue-400">Input: </span>{result.input}</p>
                              <p><span className="text-blue-400">Expected: </span>{result.expected}</p>
                              <p><span className="text-blue-400">Actual: </span><span className={result.passed ? 'text-green-400' : 'text-red-400'}>{result.actual}</span></p>
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
