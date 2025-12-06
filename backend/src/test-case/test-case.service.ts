import { Injectable } from '@nestjs/common'
import { SupabaseService } from '../supabase/supabase.service'

export interface TestCase {
  test_case_id: number
  challenge_id: number
  input: string
  expected_output: string
  description: string
  is_sample: boolean
}

@Injectable()
export class TestCaseService {
  constructor(private supabaseService: SupabaseService) {}

  // Map of challenge titles to their test cases
  private testCasesByTitle: {
    [key: string]: Omit<TestCase, 'challenge_id'>[]
  } = {
    'Two Sum': [
      {
        test_case_id: 1,
        input: '[2,7,11,15], 9',
        expected_output: '[0,1]',
        description: 'Example 1: Two numbers that sum to target',
        is_sample: true,
      },
      {
        test_case_id: 2,
        input: '[3,2,4], 6',
        expected_output: '[1,2]',
        description: 'Example 2: Another pair that sums to target',
        is_sample: true,
      },
      {
        test_case_id: 3,
        input: '[3,3], 6',
        expected_output: '[0,1]',
        description: 'Example 3: Duplicate values',
        is_sample: true,
      },
    ],
    'Binary Search Tree': [
      {
        test_case_id: 4,
        input: 'tree = [3,1,4,null,2], k = 1',
        expected_output: '1',
        description: 'Kth smallest value in BST - k=1 should return 1',
        is_sample: true,
      },
      {
        test_case_id: 5,
        input: 'tree = [5,3,6,2,4,null,null,1], k = 3',
        expected_output: '3',
        description: 'Kth smallest value in BST - k=3 should return 3',
        is_sample: true,
      },
    ],
    'Debug the Loop': [
      {
        test_case_id: 6,
        input: 'n = 5',
        expected_output: '15',
        description: 'Sum from 1 to 5 should be 15',
        is_sample: true,
      },
      {
        test_case_id: 7,
        input: 'n = 10',
        expected_output: '55',
        description: 'Sum from 1 to 10 should be 55',
        is_sample: true,
      },
    ],
    'Merge K Sorted Lists': [
      {
        test_case_id: 8,
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        expected_output: '[1,1,2,3,4,4,5,6]',
        description: 'Merge three sorted lists',
        is_sample: true,
      },
      {
        test_case_id: 9,
        input: 'lists = []',
        expected_output: '[]',
        description: 'Empty list of lists',
        is_sample: true,
      },
    ],
    'Binary Tree Max Path': [
      {
        test_case_id: 10,
        input: 'tree = [1,2,3]',
        expected_output: '6',
        description: 'Max path sum for simple tree: 2 + 1 + 3 = 6',
        is_sample: true,
      },
      {
        test_case_id: 11,
        input: 'tree = [-10]',
        expected_output: '-10',
        description: 'Single node with negative value',
        is_sample: true,
      },
    ],
  }

  // Cache for challenge ID -> title mapping
  private challengeTitleCache: { [key: number]: string } = {}

  /**
   * Get challenge title from database by ID
   */
  private async getChallengeTitleById(
    challengeId: number,
  ): Promise<string | null> {
    // Check cache first
    if (this.challengeTitleCache[challengeId]) {
      return this.challengeTitleCache[challengeId]
    }

    try {
      const supabase = this.supabaseService.getClient()
      const { data, error } = await supabase
        .from('challenge')
        .select('title')
        .eq('challenge_id', challengeId)
        .single()

      if (error || !data) return null

      this.challengeTitleCache[challengeId] = data.title
      return data.title
    } catch (error) {
      console.error('Error fetching challenge title:', error)
      return null
    }
  }

  /**
   * Find all test cases for a challenge by ID
   */
  async findByChallengeId(challengeId: number): Promise<TestCase[]> {
    const title = await this.getChallengeTitleById(challengeId)

    if (!title || !this.testCasesByTitle[title]) {
      return []
    }

    // Map test cases with the actual challenge ID
    return this.testCasesByTitle[title].map((tc) => ({
      ...tc,
      challenge_id: challengeId,
    }))
  }

  /**
   * Find sample test cases for a challenge
   */
  async findSampleTestCases(challengeId: number): Promise<TestCase[]> {
    const allTestCases = await this.findByChallengeId(challengeId)
    return allTestCases.filter((tc) => tc.is_sample)
  }

  /**
   * Get all test cases (flattened)
   */
  findAll(): TestCase[] {
    const allTestCases: TestCase[] = []

    Object.entries(this.testCasesByTitle).forEach(([_title, testCases]) => {
      testCases.forEach((tc) => {
        allTestCases.push({
          ...tc,
          challenge_id: 0, // Placeholder, will be replaced when needed
        })
      })
    })

    return allTestCases
  }

  /**
   * Find single test case by ID
   */
  findOne(id: number): TestCase | undefined {
    return this.findAll().find((tc) => tc.test_case_id === id)
  }

  /**
   * Create a new test case for a challenge
   */
  async create(
    challengeId: number,
    testCase: Omit<TestCase, 'test_case_id' | 'challenge_id'>,
  ): Promise<TestCase> {
    const title = await this.getChallengeTitleById(challengeId)
    if (!title) {
      throw new Error('Challenge not found')
    }

    if (!this.testCasesByTitle[title]) {
      this.testCasesByTitle[title] = []
    }

    const newId =
      Math.max(...this.findAll().map((tc) => tc.test_case_id), 0) + 1
    const newTestCase: TestCase = {
      test_case_id: newId,
      challenge_id: challengeId,
      ...testCase,
    }

    this.testCasesByTitle[title].push(newTestCase)
    return newTestCase
  }

  /**
   * Update test case
   */
  update(
    id: number,
    updateData: Partial<Omit<TestCase, 'test_case_id' | 'challenge_id'>>,
  ): TestCase | undefined {
    const testCase = this.findOne(id)
    if (!testCase) return undefined

    const title = Object.entries(this.testCasesByTitle).find(([_, cases]) =>
      cases.some((tc) => tc.test_case_id === id),
    )?.[0]

    if (!title) return undefined

    const index = this.testCasesByTitle[title].findIndex(
      (tc) => tc.test_case_id === id,
    )
    if (index === -1) return undefined

    const updated: TestCase = { ...testCase, ...updateData }
    this.testCasesByTitle[title][index] = updated
    return updated
  }

  /**
   * Remove test case
   */
  remove(id: number): boolean {
    for (const title in this.testCasesByTitle) {
      const index = this.testCasesByTitle[title].findIndex(
        (tc) => tc.test_case_id === id,
      )
      if (index !== -1) {
        this.testCasesByTitle[title].splice(index, 1)
        return true
      }
    }
    return false
  }

  /**
   * Remove all test cases for a challenge
   */
  async removeByChallengeId(challengeId: number): Promise<number> {
    const testCases = await this.findByChallengeId(challengeId)
    let removed = 0
    for (const tc of testCases) {
      if (this.remove(tc.test_case_id)) {
        removed++
      }
    }
    return removed
  }
}
