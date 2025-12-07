import { Module } from '@nestjs/common'
import { TournamentBattleGateway } from './tournament-battle.gateway'

@Module({
  providers: [TournamentBattleGateway],
  exports: [TournamentBattleGateway],
})
export class TournamentBattleModule {}
