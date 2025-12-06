import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { TestCaseService } from './test-case.service'

interface CreateTestCaseDto {
  input: string
  expected_output: string
  description?: string
  is_sample?: boolean
}

@Controller('test-case')
export class TestCaseController {
  constructor(private readonly testCaseService: TestCaseService) {}

  @Post('challenge/:challengeId')
  async create(
    @Param('challengeId') challengeId: string,
    @Body() createTestCaseDto: CreateTestCaseDto,
  ) {
    return this.testCaseService.create(+challengeId, {
      input: createTestCaseDto.input,
      expected_output: createTestCaseDto.expected_output,
      description: createTestCaseDto.description || '',
      is_sample: createTestCaseDto.is_sample ?? true,
    })
  }

  @Get()
  findAll() {
    return this.testCaseService.findAll()
  }

  @Get('challenge/:challengeId')
  async findByChallengeId(@Param('challengeId') challengeId: string) {
    return this.testCaseService.findByChallengeId(+challengeId)
  }

  @Get('challenge/:challengeId/samples')
  async findSampleTestCases(@Param('challengeId') challengeId: string) {
    return this.testCaseService.findSampleTestCases(+challengeId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testCaseService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateTestCaseDto>,
  ) {
    return this.testCaseService.update(+id, updateData)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.testCaseService.remove(+id)
    return { message: 'Test case removed' }
  }

  @Delete('challenge/:challengeId')
  async removeByChallengeId(@Param('challengeId') challengeId: string) {
    const removed = await this.testCaseService.removeByChallengeId(+challengeId)
    return { message: `${removed} test cases removed` }
  }
}
