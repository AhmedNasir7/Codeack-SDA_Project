import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { LeaderboardEntriesService } from './leaderboard-entries.service';
import { CreateLeaderboardEntryDto } from '../dto/create-leaderboard-entry.dto';

@Controller('leaderboard-entries')
export class LeaderboardEntriesController {
  constructor(
    private readonly leaderboardEntriesService: LeaderboardEntriesService,
  ) {}

  @Post()
  create(@Body() createDto: CreateLeaderboardEntryDto) {
    return this.leaderboardEntriesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.leaderboardEntriesService.findAll();
  }

  @Get('leaderboard/:leaderboardId')
  findByLeaderboardId(
    @Param('leaderboardId', ParseIntPipe) leaderboardId: number,
  ) {
    return this.leaderboardEntriesService.findByLeaderboardId(leaderboardId);
  }

  @Get('leaderboard/:leaderboardId/top')
  getTopN(
    @Param('leaderboardId', ParseIntPipe) leaderboardId: number,
    @Query('limit') limit: string = '10',
  ) {
    return this.leaderboardEntriesService.getTopN(
      leaderboardId,
      parseInt(limit, 10),
    );
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.leaderboardEntriesService.findByUserId(userId);
  }

  @Get('team/:teamId')
  findByTeamId(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.leaderboardEntriesService.findByTeamId(teamId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leaderboardEntriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<CreateLeaderboardEntryDto>,
  ) {
    return this.leaderboardEntriesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leaderboardEntriesService.remove(id);
  }
}

