import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common'
import { JudgeService } from './judge.service'

interface EvaluateSubmissionDto {
  source_code: string
  language_id: number
  submission_id?: number
}

interface RunTestsDto {
  source_code: string
  language_id: number
}

@Controller('judge')
export class JudgeController {
  constructor(private readonly judgeService: JudgeService) {}

  /**
   * Evaluate a submission (runs all test cases including hidden)
   * Called when user submits their solution
   */
  @Post('evaluate/:challengeId')
  async evaluateSubmission(
    @Param('challengeId', ParseIntPipe) challengeId: number,
    @Body() dto: EvaluateSubmissionDto,
  ) {
    return this.judgeService.evaluateSubmission(
      challengeId,
      dto.source_code,
      dto.language_id,
      dto.submission_id,
    )
  }

  /**
   * Run code against visible test cases only (for preview)
   * Called when user clicks "Run Code" or "Test" during development
   */
  @Post('test/:challengeId')
  async runTests(
    @Param('challengeId', ParseIntPipe) challengeId: number,
    @Body() dto: RunTestsDto,
  ) {
    return this.judgeService.runAgainstVisibleTests(
      challengeId,
      dto.source_code,
      dto.language_id,
    )
  }
}
