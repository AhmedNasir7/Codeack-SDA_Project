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
import { LeaderboardService } from './leaderboard.service';
import { CreateLeaderboardDto } from '../dto/create-leaderboard.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Post()
  create(@Body() createLeaderboardDto: CreateLeaderboardDto) {
    return this.leaderboardService.create(createLeaderboardDto);
  }

  @Get()
  findAll() {
    return this.leaderboardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leaderboardService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaderboardDto: Partial<CreateLeaderboardDto>,
  ) {
    return this.leaderboardService.update(id, updateLeaderboardDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leaderboardService.remove(id);
  }
}

