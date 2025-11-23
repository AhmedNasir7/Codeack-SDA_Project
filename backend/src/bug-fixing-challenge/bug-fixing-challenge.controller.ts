import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BugFixingChallengeService } from './bug-fixing-challenge.service';
import { CreateBugFixingChallengeDto } from '../dto/create-bug-fixing-challenge.dto';

@Controller('bug-fixing-challenge')
export class BugFixingChallengeController {
  constructor(
    private readonly bugFixingChallengeService: BugFixingChallengeService,
  ) {}

  @Post()
  create(@Body() createDto: CreateBugFixingChallengeDto) {
    return this.bugFixingChallengeService.create(createDto);
  }

  @Get()
  findAll() {
    return this.bugFixingChallengeService.findAll();
  }

  @Get('challenge/:challengeId')
  findByChallengeId(@Param('challengeId', ParseIntPipe) challengeId: number) {
    return this.bugFixingChallengeService.findByChallengeId(challengeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bugFixingChallengeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<CreateBugFixingChallengeDto>,
  ) {
    return this.bugFixingChallengeService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bugFixingChallengeService.remove(id);
  }
}

