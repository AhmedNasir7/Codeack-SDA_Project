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
import { TournamentChallengesService } from './tournament-challenges.service';
import { CreateTournamentChallengeDto } from '../dto/create-tournament-challenge.dto';

@Controller('tournament-challenges')
export class TournamentChallengesController {
  constructor(
    private readonly tournamentChallengesService: TournamentChallengesService,
  ) {}

  @Post()
  create(@Body() createDto: CreateTournamentChallengeDto) {
    return this.tournamentChallengesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.tournamentChallengesService.findAll();
  }

  @Get('tournament/:tournamentId')
  findByTournamentId(@Param('tournamentId', ParseIntPipe) tournamentId: number) {
    return this.tournamentChallengesService.findByTournamentId(tournamentId);
  }

  @Get('challenge/:challengeId')
  findByChallengeId(@Param('challengeId', ParseIntPipe) challengeId: number) {
    return this.tournamentChallengesService.findByChallengeId(challengeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentChallengesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<CreateTournamentChallengeDto>,
  ) {
    return this.tournamentChallengesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentChallengesService.remove(id);
  }
}

