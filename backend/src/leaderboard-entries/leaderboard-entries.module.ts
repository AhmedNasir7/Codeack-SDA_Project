import { Module } from '@nestjs/common';
import { LeaderboardEntriesService } from './leaderboard-entries.service';
import { LeaderboardEntriesController } from './leaderboard-entries.controller';

@Module({
  controllers: [LeaderboardEntriesController],
  providers: [LeaderboardEntriesService],
  exports: [LeaderboardEntriesService],
})
export class LeaderboardEntriesModule {}

