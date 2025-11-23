import { Module } from '@nestjs/common';
import { BugFixingChallengeService } from './bug-fixing-challenge.service';
import { BugFixingChallengeController } from './bug-fixing-challenge.controller';

@Module({
  controllers: [BugFixingChallengeController],
  providers: [BugFixingChallengeService],
  exports: [BugFixingChallengeService],
})
export class BugFixingChallengeModule {}

