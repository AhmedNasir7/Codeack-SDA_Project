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
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from '../dto/create-challenge.dto';

@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Post()
  create(@Body() createChallengeDto: CreateChallengeDto) {
    return this.challengeService.create(createChallengeDto);
  }

  @Get()
  findAll() {
    return this.challengeService.findAll();
  }

  @Get('difficulty/:difficulty')
  findByDifficulty(@Param('difficulty') difficulty: string) {
    return this.challengeService.findByDifficulty(difficulty);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.challengeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChallengeDto: Partial<CreateChallengeDto>,
  ) {
    return this.challengeService.update(id, updateChallengeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.challengeService.remove(id);
  }
}

