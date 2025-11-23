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
import { TeamService } from './team.service';
import { CreateTeamDto } from '../dto/create-team.dto';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamDto: Partial<CreateTeamDto>,
  ) {
    return this.teamService.update(id, updateTeamDto);
  }

  @Patch(':id/increment-member')
  incrementMember(
    @Param('id', ParseIntPipe) id: number,
    @Body('increment') increment: number = 1,
  ) {
    return this.teamService.incrementMemberCount(id, increment);
  }

  @Patch(':id/add-score')
  addScore(
    @Param('id', ParseIntPipe) id: number,
    @Body('score') score: number,
  ) {
    return this.teamService.addScore(id, score);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.remove(id);
  }
}

