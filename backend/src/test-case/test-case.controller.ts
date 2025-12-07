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
import { CreateTestCaseDto } from '../dto/create-test-case.dto'

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
      is_hidden: createTestCaseDto.is_hidden ?? false,
      weight:
        createTestCaseDto.weight === undefined
          ? undefined
          : Number(createTestCaseDto.weight),
    })
  }

  @Get()
  findAll() {
    return this.testCaseService.findAll()
  }

  @Get('challenge/:challengeId')
  async findByChallengeId(@Param('challengeId') challengeId: string) {
    return this.testCaseService.findVisibleTestCases(+challengeId)
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
    return this.testCaseService.update(+id, {
      ...updateData,
      weight:
        updateData.weight === undefined ? undefined : Number(updateData.weight),
    })
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
