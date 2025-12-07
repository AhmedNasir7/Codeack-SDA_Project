import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { CompilerService } from '../compiler/compiler.service'
import { TestCaseService } from '../test-case/test-case.service'

export interface EvaluationResult {
  test_case_id: number
  passed: boolean
  weight: number
  stdout: string
  stderr: string
  compile_output?: string
  time?: number
  memory?: number
  status?: number
  error?: string
}

export interface SubmissionEvaluation {
  submission_id?: number
  challenge_id: number
  passed_count: number
  total_count: number
  score: number
  total_weight: number
  results: EvaluationResult[]
  status: 'accepted' | 'partial' | 'rejected'
}

@Injectable()
export class JudgeService {
  private readonly logger = new Logger(JudgeService.name)

  constructor(
    private readonly compilerService: CompilerService,
    private readonly testCaseService: TestCaseService,
  ) {}

  /**
   * Evaluate a submission against all test cases (including hidden)
   */
  async evaluateSubmission(
    challengeId: number,
    sourceCode: string,
    languageId: number,
    submissionId?: number,
  ): Promise<SubmissionEvaluation> {
    if (!sourceCode || sourceCode.trim() === '') {
      throw new BadRequestException('Source code cannot be empty')
    }

    // Fetch all test cases (including hidden) for evaluation
    const testCases = await this.testCaseService.findAllTestCasesForEvaluation(
      challengeId,
    )

    if (testCases.length === 0) {
      throw new BadRequestException(
        'No test cases found for this challenge',
      )
    }

    const results: EvaluationResult[] = []
    let passedCount = 0
    let totalWeight = 0

    this.logger.log(
      `Evaluating submission for challenge ${challengeId} against ${testCases.length} test cases`,
    )

    // Evaluate each test case
    for (const testCase of testCases) {
      totalWeight += testCase.weight

      try {
        const executionResult = await this.compilerService.runCode({
          languageId,
          sourceCode,
          stdin: testCase.input,
        })

        // Check if compilation failed
        if (executionResult.status && executionResult.status.id !== 1) {
          // Status 1 = accepted, other statuses indicate errors
          const statusMap: { [key: number]: string } = {
            6: 'Compilation Error',
            7: 'Runtime Error',
            8: 'Execution Timeout',
            9: 'Memory Limit Exceeded',
          }

          results.push({
            test_case_id: testCase.test_case_id,
            passed: false,
            weight: testCase.weight,
            stdout: executionResult.stdout || '',
            stderr: executionResult.stderr || '',
            compile_output: executionResult.compile_output,
            time: executionResult.time,
            memory: executionResult.memory,
            status: executionResult.status.id,
            error: statusMap[executionResult.status.id] || 'Unknown Error',
          })

          continue
        }

        // Compare output
        const passed = this.testCaseService.compareOutput(
          executionResult.stdout,
          testCase.expected_output,
        )

        if (passed) {
          passedCount++
        }

        results.push({
          test_case_id: testCase.test_case_id,
          passed,
          weight: testCase.weight,
          stdout: executionResult.stdout || '',
          stderr: executionResult.stderr || '',
          compile_output: executionResult.compile_output,
          time: executionResult.time,
          memory: executionResult.memory,
          status: executionResult.status?.id,
        })

        this.logger.debug(
          `Test case ${testCase.test_case_id}: ${passed ? 'PASS' : 'FAIL'}`,
        )
      } catch (error) {
        this.logger.error(
          `Error evaluating test case ${testCase.test_case_id}:`,
          error,
        )

        results.push({
          test_case_id: testCase.test_case_id,
          passed: false,
          weight: testCase.weight,
          stdout: '',
          stderr: error instanceof Error ? error.message : 'Unknown error',
          error: 'Execution Error',
        })
      }
    }

    // Calculate score based on passed weights
    const passedWeight = results
      .filter((r) => r.passed)
      .reduce((sum, r) => sum + r.weight, 0)
    const score = totalWeight > 0 ? (passedWeight / totalWeight) * 100 : 0

    // Determine overall status
    let status: 'accepted' | 'partial' | 'rejected' = 'rejected'
    if (score === 100) {
      status = 'accepted'
    } else if (score > 0) {
      status = 'partial'
    }

    this.logger.log(
      `Submission evaluation complete: ${status} (${score.toFixed(2)}%)`,
    )

    return {
      submission_id: submissionId,
      challenge_id: challengeId,
      passed_count: passedCount,
      total_count: testCases.length,
      score,
      total_weight: totalWeight,
      results,
      status,
    }
  }

  /**
   * Run code against visible test cases only (for preview/debugging)
   */
  async runAgainstVisibleTests(
    challengeId: number,
    sourceCode: string,
    languageId: number,
  ): Promise<SubmissionEvaluation> {
    if (!sourceCode || sourceCode.trim() === '') {
      throw new BadRequestException('Source code cannot be empty')
    }

    const testCases = await this.testCaseService.findVisibleTestCases(
      challengeId,
    )

    if (testCases.length === 0) {
      throw new BadRequestException(
        'No visible test cases found for this challenge',
      )
    }

    const results: EvaluationResult[] = []
    let passedCount = 0
    let totalWeight = 0

    this.logger.log(
      `Running preview against ${testCases.length} visible test cases`,
    )

    for (const testCase of testCases) {
      totalWeight += testCase.weight

      try {
        const executionResult = await this.compilerService.runCode({
          languageId,
          sourceCode,
          stdin: testCase.input,
        })

        const passed = this.testCaseService.compareOutput(
          executionResult.stdout,
          testCase.expected_output,
        )

        if (passed) {
          passedCount++
        }

        results.push({
          test_case_id: testCase.test_case_id,
          passed,
          weight: testCase.weight,
          stdout: executionResult.stdout || '',
          stderr: executionResult.stderr || '',
          compile_output: executionResult.compile_output,
          time: executionResult.time,
          memory: executionResult.memory,
          status: executionResult.status?.id,
        })
      } catch (error) {
        results.push({
          test_case_id: testCase.test_case_id,
          passed: false,
          weight: testCase.weight,
          stdout: '',
          stderr: error instanceof Error ? error.message : 'Unknown error',
          error: 'Execution Error',
        })
      }
    }

    const passedWeight = results
      .filter((r) => r.passed)
      .reduce((sum, r) => sum + r.weight, 0)
    const score = totalWeight > 0 ? (passedWeight / totalWeight) * 100 : 0

    let status: 'accepted' | 'partial' | 'rejected' = 'rejected'
    if (score === 100) {
      status = 'accepted'
    } else if (score > 0) {
      status = 'partial'
    }

    return {
      challenge_id: challengeId,
      passed_count: passedCount,
      total_count: testCases.length,
      score,
      total_weight: totalWeight,
      results,
      status,
    }
  }
}
