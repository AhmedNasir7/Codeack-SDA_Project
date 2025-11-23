import { Module } from '@nestjs/common';
import { TournamentChallengesService } from './tournament-challenges.service';
import { TournamentChallengesController } from './tournament-challenges.controller';

@Module({
  controllers: [TournamentChallengesController],
  providers: [TournamentChallengesService],
  exports: [TournamentChallengesService],
})
export class TournamentChallengesModule {}

