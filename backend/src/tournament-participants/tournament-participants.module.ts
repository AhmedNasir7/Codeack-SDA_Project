import { Module } from '@nestjs/common'
import { TournamentParticipantsService } from './tournament-participants.service'
import { TournamentParticipantsController } from './tournament-participants.controller'
import { SupabaseModule } from '../supabase/supabase.module'

@Module({
  imports: [SupabaseModule],
  controllers: [TournamentParticipantsController],
  providers: [TournamentParticipantsService],
  exports: [TournamentParticipantsService],
})
export class TournamentParticipantsModule {}
