import { Module } from '@nestjs/common';
import { CodingBattleService } from './coding-battle.service';
import { CodingBattleController } from './coding-battle.controller';

@Module({
  controllers: [CodingBattleController],
  providers: [CodingBattleService],
  exports: [CodingBattleService],
})
export class CodingBattleModule {}

