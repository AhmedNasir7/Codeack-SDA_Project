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
import { CodingBattleService } from './coding-battle.service';
import { CreateCodingBattleDto } from '../dto/create-coding-battle.dto';

@Controller('coding-battle')
export class CodingBattleController {
  constructor(private readonly codingBattleService: CodingBattleService) {}

  @Post()
  create(@Body() createDto: CreateCodingBattleDto) {
    return this.codingBattleService.create(createDto);
  }

  @Get()
  findAll() {
    return this.codingBattleService.findAll();
  }

  @Get('challenge/:challengeId')
  findByChallengeId(@Param('challengeId', ParseIntPipe) challengeId: number) {
    return this.codingBattleService.findByChallengeId(challengeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.codingBattleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<CreateCodingBattleDto>,
  ) {
    return this.codingBattleService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.codingBattleService.remove(id);
  }
}

