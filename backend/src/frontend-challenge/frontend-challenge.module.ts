import { Module } from '@nestjs/common';
import { FrontendChallengeService } from './frontend-challenge.service';
import { FrontendChallengeController } from './frontend-challenge.controller';

@Module({
  controllers: [FrontendChallengeController],
  providers: [FrontendChallengeService],
  exports: [FrontendChallengeService],
})
export class FrontendChallengeModule {}

