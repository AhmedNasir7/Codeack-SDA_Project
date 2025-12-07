import { Module } from '@nestjs/common'
import { TournamentService } from './tournament.service'
import { TournamentController } from './tournament.controller'
import { SupabaseModule } from '../supabase/supabase.module'

@Module({
  imports: [SupabaseModule],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentModule {}
