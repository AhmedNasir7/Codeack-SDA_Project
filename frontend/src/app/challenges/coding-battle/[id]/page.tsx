'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { authService } from '@/lib/authService'
import Navbar from '@/components/Navbar'
import {
  compilerService,
  RunCodeResponse,
} from '@/lib/compilerService'

interface Question {
  id: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  statement: string
  examples: Array<{ input: string; output: string; explanation: string }>
  constraints: string[]
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
    lookup = {}
    for idx, num in enumerate(nums):
        complement = target - num
        if complement in lookup:
            return [lookup[complement], idx]
        lookup[num] = idx
    return []


if __name__ == "__main__":
    print(two_sum([2, 7, 11, 15], 9))`,
  },
  {
    value: 'javascript',
    label: 'JavaScript',
    judge0Id: 63,
    template: `function twoSum(nums, target) {
  const map = new Map()
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (map.has(complement)) {
      return [map.get(complement), i]
    }
    map.set(nums[i], i)
  }
  return []
}

console.log(twoSum([2, 7, 11, 15], 9))`,
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

export default function CodingBattleEditorPage() {
  const router = useRouter()
  const params = useParams()
  const battleId = params.id as string
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<LanguageValue>(
    LANGUAGE_PRESETS[0].value,
  )
  const [code, setCode] = useState(LANGUAGE_PRESETS[0].template)
  const [selectedQuestion, setSelectedQuestion] = useState(1)
  const [activeTab, setActiveTab] = useState<'testcases' | 'output'>(
    'testcases',
  )
  const [isRunning, setIsRunning] = useState(false)
  const [runResult, setRunResult] = useState<RunCodeResponse | null>(null)
  const [runError, setRunError] = useState<string | null>(null)

  const questions: { [key: number]: Question } = {
    1: {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      statement:
        'Given an array of integers, which indices of the two numbers such that they add up to a specific target.',
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
        },
      ],
      constraints: [
        '2 ≤ nums.length ≤ 10⁴',
        '-10⁹ ≤ nums[i] ≤ 10⁹',
        '-10⁹ ≤ target ≤ 10⁹',
        'Only one valid answer exists.',
      ],
    },
    2: {
      id: 2,
      title: 'Longest Substring',
      difficulty: 'Medium',
      statement:
        'Given a string, find the length of the longest substring without repeating characters.',
      examples: [
        {
          input: 's = "abcabcbb"',
          output: '3',
          explanation: 'The answer is "abc", with the length of 3.',
        },
      ],
      constraints: [
        '0 ≤ s.length ≤ 5 × 10⁴',
        's consists of English letters, digits, symbols and spaces.',
      ],
    },
    3: {
      id: 3,
      title: 'Median of Two Sorted Arrays',
      difficulty: 'Hard',
      statement:
        'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
      examples: [
        {
          input: 'nums1 = [1,3], nums2 = [2]',
          output: '2.00000',
          explanation: 'merged array = [1,2,3] and median is 2.',
        },
      ],
      constraints: [
        'nums1.length == m',
        'nums2.length == n',
        '0 ≤ m ≤ 1000',
        '0 ≤ n ≤ 1000',
        '1 ≤ m + n ≤ 2000',
      ],
    },
    4: {
      id: 4,
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      statement:
        'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
      examples: [
        {
          input: 's = "()"',
          output: 'true',
          explanation: 'The parentheses are balanced.',
        },
      ],
      constraints: [
        '1 ≤ s.length ≤ 10⁴',
        "s consists of parentheses only '()[]{}' ",
      ],
    },
    5: {
      id: 5,
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      statement:
        'You are climbing a staircase. It takes n steps to reach the top. You can climb 1 or 2 steps at a time.',
      examples: [
        {
          input: 'n = 3',
          output: '3',
          explanation:
            'There are three ways to climb to the top: 1+1+1, 1+2, 2+1',
        },
      ],
      constraints: ['1 ≤ n ≤ 45'],
    },
  }

  const currentQuestion = questions[selectedQuestion]
  const languagePreset = useMemo(
    () => LANGUAGE_PRESETS.find((preset) => preset.value === language),
    [language],
  )
  const codeLines = useMemo(() => {
    const lines = (code || '').split('\n')
    return lines.length ? lines : ['']
  }, [code])

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const currentUser = authService.getUser()
    setUser(currentUser)
    setLoading(false)
  }, [router])

  const handleLanguageChange = (nextLanguage: LanguageValue) => {
    setLanguage(nextLanguage)
    const preset =
      LANGUAGE_PRESETS.find((option) => option.value === nextLanguage) ??
      LANGUAGE_PRESETS[0]
    setCode(preset.template)
    setRunResult(null)
    setRunError(null)
  }

  const handleRunCode = async () => {
    if (!languagePreset) return

    setIsRunning(true)
    setActiveTab('output')
    setRunError(null)

    try {
      const response = await compilerService.runCode({
        languageId: languagePreset.judge0Id,
        sourceCode: code,
      })
      setRunResult(response)
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

  return (
    <main className="min-h-screen bg-linear-to-b from-[#0a0e27] via-[#0d1117] to-[#0a0e27] text-white">
      <Navbar />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Question List */}
        <div className="w-1/4 border-r border-zinc-800 overflow-y-auto p-6">
          <h2 className="text-lg font-bold mb-4">
            Battle #{battleId} – Select a Question
          </h2>
          <div className="space-y-2">
            {Object.values(questions).map((q) => (
              <button
                key={q.id}
                onClick={() => setSelectedQuestion(q.id)}
                className={`w-full text-left p-3 rounded border transition-colors ${
                  selectedQuestion === q.id
                    ? 'bg-blue-950/30 border-blue-500 text-white'
                    : 'bg-transparent border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                <div className="font-semibold text-sm">{q.title}</div>
                <div className="text-xs mt-1">
                  <span
                    className={`${
                      q.difficulty === 'Easy'
                        ? 'text-green-400'
                        : q.difficulty === 'Medium'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Middle - Problem Description */}
        <div className="w-1/3 border-r border-zinc-800 overflow-y-auto p-8">
          <div className="max-w-2xl">
            {/* Problem Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {currentQuestion.title}
              </h1>
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                  currentQuestion.difficulty === 'Easy'
                    ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                    : currentQuestion.difficulty === 'Medium'
                      ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50'
                      : 'bg-red-900/30 text-red-400 border border-red-700/50'
                }`}
              >
                {currentQuestion.difficulty}
              </span>
            </div>

            {/* Problem Statement */}
            <div className="mb-6">
              <h3 className="text-white font-bold mb-3">Problem Statement</h3>
              <p className="text-zinc-300 leading-relaxed">
                {currentQuestion.statement}
              </p>
            </div>

            {/* Example */}
            <div className="mb-6">
              <h3 className="text-white font-bold mb-3">
                Example Input/Output
              </h3>
              <div className="bg-blue-950/30 border border-blue-900/50 rounded p-4 space-y-2 text-sm">
                <p>
                  <span className="text-blue-400">Input:</span>{' '}
                  <span className="text-zinc-300">
                    {currentQuestion.examples[0].input}
                  </span>
                </p>
                <p>
                  <span className="text-blue-400">Output:</span>{' '}
                  <span className="text-zinc-300">
                    {currentQuestion.examples[0].output}
                  </span>
                </p>
                <p>
                  <span className="text-blue-400">Explanation:</span>{' '}
                  <span className="text-zinc-300">
                    {currentQuestion.examples[0].explanation}
                  </span>
                </p>
              </div>
            </div>

            {/* Constraints */}
            <div>
              <h3 className="text-white font-bold mb-3">Constraints</h3>
              <ul className="text-zinc-300 space-y-2 text-sm">
                {currentQuestion.constraints.map((constraint, idx) => (
                  <li key={idx}>• {constraint}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right - Code Editor */}
        <div className="w-2/5 border-l border-zinc-800 overflow-hidden flex flex-col">
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

          {/* Tabs - Test Cases, Output */}
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

          {/* Test Case Result / Output */}
          <div className="border-t border-zinc-800 px-6 py-3 max-h-40 overflow-auto flex flex-col">
            {activeTab === 'testcases' ? (
              <>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-white font-bold text-sm">
                    Test Case 1
                  </h4>
                  <span className="text-zinc-500 text-xs bg-zinc-800 px-2 py-1 rounded">
                    Reference
                  </span>
                </div>
                <div className="space-y-2 text-xs text-zinc-300 bg-blue-950/30 border border-blue-900/50 rounded p-3 flex-1">
                  <p>
                    <span className="text-blue-400">Input: </span>
                    {currentQuestion.examples[0].input}
                  </p>
                  <p>
                    <span className="text-blue-400">Expected: </span>
                    {currentQuestion.examples[0].output}
                  </p>
                </div>
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
                {runResult?.status?.description && (
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wide">
                    <span>Status</span>
                    <span className="text-emerald-400">
                      {runResult.status.description}
                    </span>
                  </div>
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
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-blue-400 font-bold rounded text-sm transition-colors disabled:opacity-60"
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
              {isRunning ? 'Running...' : 'Run Tests'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-sm transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              Submit Solution
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
