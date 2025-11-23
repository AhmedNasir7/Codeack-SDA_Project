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
import { TournamentParticipantsService } from './tournament-participants.service';
import { CreateTournamentParticipantDto } from '../dto/create-tournament-participant.dto';

@Controller('tournament-participants')
export class TournamentParticipantsController {
  constructor(
    private readonly tournamentParticipantsService: TournamentParticipantsService,
  ) {}

  @Post()
  create(@Body() createDto: CreateTournamentParticipantDto) {
    return this.tournamentParticipantsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.tournamentParticipantsService.findAll();
  }

  @Get('tournament/:tournamentId')
  findByTournamentId(@Param('tournamentId', ParseIntPipe) tournamentId: number) {
    return this.tournamentParticipantsService.findByTournamentId(tournamentId);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.tournamentParticipantsService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentParticipantsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<CreateTournamentParticipantDto>,
  ) {
    return this.tournamentParticipantsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentParticipantsService.remove(id);
  }
}

