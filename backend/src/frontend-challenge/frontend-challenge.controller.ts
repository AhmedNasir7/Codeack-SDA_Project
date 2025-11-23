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
import { FrontendChallengeService } from './frontend-challenge.service';
import { CreateFrontendChallengeDto } from '../dto/create-frontend-challenge.dto';

@Controller('frontend-challenge')
export class FrontendChallengeController {
  constructor(
    private readonly frontendChallengeService: FrontendChallengeService,
  ) {}

  @Post()
  create(@Body() createDto: CreateFrontendChallengeDto) {
    return this.frontendChallengeService.create(createDto);
  }

  @Get()
  findAll() {
    return this.frontendChallengeService.findAll();
  }

  @Get('challenge/:challengeId')
  findByChallengeId(@Param('challengeId', ParseIntPipe) challengeId: number) {
    return this.frontendChallengeService.findByChallengeId(challengeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.frontendChallengeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<CreateFrontendChallengeDto>,
  ) {
    return this.frontendChallengeService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.frontendChallengeService.remove(id);
  }
}

