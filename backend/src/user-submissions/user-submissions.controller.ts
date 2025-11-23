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
import { UserSubmissionsService } from './user-submissions.service';
import { CreateUserSubmissionDto } from '../dto/create-user-submission.dto';

@Controller('user-submissions')
export class UserSubmissionsController {
  constructor(
    private readonly userSubmissionsService: UserSubmissionsService,
  ) {}

  @Post()
  create(@Body() createDto: CreateUserSubmissionDto) {
    return this.userSubmissionsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.userSubmissionsService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.userSubmissionsService.findByUserId(userId);
  }

  @Get('challenge/:challengeId')
  findByChallengeId(@Param('challengeId', ParseIntPipe) challengeId: number) {
    return this.userSubmissionsService.findByChallengeId(challengeId);
  }

  @Get('user/:userId/challenge/:challengeId')
  findByUserAndChallenge(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('challengeId', ParseIntPipe) challengeId: number,
  ) {
    return this.userSubmissionsService.findByUserAndChallenge(
      userId,
      challengeId,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userSubmissionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<CreateUserSubmissionDto>,
  ) {
    return this.userSubmissionsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userSubmissionsService.remove(id);
  }
}

