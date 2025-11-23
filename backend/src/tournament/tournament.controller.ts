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
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from '../dto/create-tournament.dto';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post()
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentService.create(createTournamentDto);
  }

  @Get()
  findAll() {
    return this.tournamentService.findAll();
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.tournamentService.findByStatus(status);
  }

  @Get('active')
  findActive() {
    return this.tournamentService.findActive();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTournamentDto: Partial<CreateTournamentDto>,
  ) {
    return this.tournamentService.update(id, updateTournamentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentService.remove(id);
  }
}

