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
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from '../dto/create-team-member.dto';

@Controller('team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Post()
  create(@Body() createDto: CreateTeamMemberDto) {
    return this.teamMembersService.create(createDto);
  }

  @Get()
  findAll() {
    return this.teamMembersService.findAll();
  }

  @Get('team/:teamId')
  findByTeamId(@Param('teamId', ParseIntPipe) teamId: number) {
    return this.teamMembersService.findByTeamId(teamId);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.teamMembersService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamMembersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<CreateTeamMemberDto>,
  ) {
    return this.teamMembersService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamMembersService.remove(id);
  }

  @Delete('team/:teamId/user/:userId')
  removeByTeamAndUser(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.teamMembersService.removeByTeamAndUser(teamId, userId);
  }
}

