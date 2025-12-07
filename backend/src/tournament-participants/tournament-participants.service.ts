import { Injectable } from '@nestjs/common'
import { SupabaseService } from '../supabase/supabase.service'
import { CreateTournamentParticipantDto } from '../dto/create-tournament-participant.dto'
import { SubmitBattleResultDto } from '../dto/submit-battle-result.dto'

@Injectable()
export class TournamentParticipantsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createDto: CreateTournamentParticipantDto) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('tournament_participants')
      .insert(createDto)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async findAll() {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('tournament_participants')
      .select('*')

    if (error) throw error
    return data
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('tournament_participants')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  async findByTournamentId(tournamentId: number) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('tournament_participants')
      .select('*')
      .eq('tournament_id', tournamentId)

    if (error) throw error
    return data
  }

  async findByUserId(userId: number) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('tournament_participants')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }

  async update(
    id: number,
    updateData: Partial<CreateTournamentParticipantDto>,
  ) {
    const supabase = this.supabaseService.getClient()
    const { data, error } = await supabase
      .from('tournament_participants')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient()
    const { error } = await supabase
      .from('tournament_participants')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { message: 'Tournament participant removed successfully' }
  }

  async joinBattle(tournamentId: number, userId: number) {
    const supabase = this.supabaseService.getClient()

    try {
      // 1. Check if user already registered for this tournament
      const { data: existing, error: checkError } = await supabase
        .from('tournament_participants')
        .select('*')
        .eq('tournament_id', tournamentId)
        .eq('user_id', userId)
        .single()

      if (existing) {
        // User already in tournament, return their record
        return {
          participant: existing,
          opponent: null,
          message: 'Already registered',
        }
      }

      // 2. Register the user for the tournament
      const { data: newParticipant, error: createError } = await supabase
        .from('tournament_participants')
        .insert({
          tournament_id: tournamentId,
          user_id: userId,
          registration_date: new Date().toISOString(),
          final_score: 0,
          final_rank: null,
        })
        .select()
        .single()

      if (createError) throw createError

      // 3. Find an available opponent (someone already in tournament but without a battle partner)
      // For now, just return the first participant found (excluding the current user)
      const { data: allParticipants, error: findError } = await supabase
        .from('tournament_participants')
        .select('*')
        .eq('tournament_id', tournamentId)
        .neq('user_id', userId)
        .limit(1)

      if (findError) throw findError

      return {
        participant: newParticipant,
        opponent:
          allParticipants && allParticipants.length > 0
            ? allParticipants[0]
            : null,
        message:
          allParticipants && allParticipants.length > 0
            ? 'Opponent found!'
            : 'Waiting for opponent...',
      }
    } catch (error) {
      throw error
    }
  }

  async submitBattleResult(resultDto: SubmitBattleResultDto) {
    const supabase = this.supabaseService.getClient()

    try {
      console.log('='.repeat(80))
      console.log('[SUBMIT_RESULT_START]')
      console.log('Received DTO:', JSON.stringify(resultDto, null, 2))
      console.log('='.repeat(80))

      const winnerId = resultDto.winner_id

      // Determine loser ID - it's the one who is NOT the winner
      let loserId = resultDto.opponent_id

      // If opponent_id is missing, find the other participant from database
      if (!loserId || loserId === winnerId) {
        const { data: participants, error: fetchError } = await supabase
          .from('tournament_participants')
          .select('user_id')
          .eq('tournament_id', resultDto.tournament_id)

        if (fetchError) throw fetchError

        // Find the participant who is NOT the winner
        loserId = participants?.find((p) => p.user_id !== winnerId)?.user_id
        console.log(`🔍 Found loserId from DB: ${loserId}`)
      } else {
        loserId = resultDto.opponent_id
      }

      // Verify we have both IDs
      if (!winnerId || !loserId) {
        throw new Error(
          `Cannot determine winner/loser: winnerId=${winnerId}, loserId=${loserId}`,
        )
      }

      const winnerScore =
        resultDto.user_score > resultDto.opponent_score
          ? resultDto.user_score
          : resultDto.opponent_score
      const loserScore =
        resultDto.user_score <= resultDto.opponent_score
          ? resultDto.user_score
          : resultDto.opponent_score

      console.log(`Calculated values:`)
      console.log(`  Winner: ${winnerId} (score: ${winnerScore})`)
      console.log(`  Loser: ${loserId} (score: ${loserScore})`)

      // First, fetch the records to verify they exist
      const { data: participantsCheck, error: checkError } = await supabase
        .from('tournament_participants')
        .select('*')
        .eq('tournament_id', resultDto.tournament_id)

      if (checkError) {
        console.error('Error fetching participants:', checkError)
        throw checkError
      }

      console.log(
        `Found ${participantsCheck?.length || 0} participants:`,
        participantsCheck,
      )

      // Update winner
      console.log(
        `Updating winner (${winnerId}) with score ${winnerScore} and rank 1`,
      )
      const { data: winnerData, error: winnerError } = await supabase
        .from('tournament_participants')
        .update({
          final_score: winnerScore,
          final_rank: 1,
        })
        .eq('tournament_id', resultDto.tournament_id)
        .eq('user_id', winnerId)
        .select()

      if (winnerError) {
        console.error('❌ Winner update error:', winnerError)
        throw winnerError
      }

      console.log(
        `✅ Winner updated: ${winnerData?.length || 0} records affected`,
        winnerData,
      )

      // Update loser
      console.log(
        `Updating loser (${loserId}) with score ${loserScore} and rank 2`,
      )
      const { data: loserData, error: loserError } = await supabase
        .from('tournament_participants')
        .update({
          final_score: loserScore,
          final_rank: 2,
        })
        .eq('tournament_id', resultDto.tournament_id)
        .eq('user_id', loserId)
        .select()

      if (loserError) {
        console.error('❌ Loser update error:', loserError)
        throw loserError
      }

      console.log(
        `✅ Loser updated: ${loserData?.length || 0} records affected`,
        loserData,
      )

      // Verify the updates
      const { data: verifyParticipants } = await supabase
        .from('tournament_participants')
        .select('*')
        .eq('tournament_id', resultDto.tournament_id)

      console.log(`Verification - Final state:`, verifyParticipants)

      // 3. Update tournament status to Completed
      console.log(
        `Updating tournament ${resultDto.tournament_id} status to Completed`,
      )
      const { error: tournamentError } = await supabase
        .from('tournament')
        .update({
          status: 'Completed',
        })
        .eq('tournament_id', resultDto.tournament_id)

      if (tournamentError) {
        console.error('❌ Tournament update error:', tournamentError)
      } else {
        console.log('✅ Tournament status updated to Completed')
      }

      console.log('[SUBMIT_RESULT_SUCCESS]')
      console.log('='.repeat(80))

      return {
        message: 'Battle result submitted successfully',
        winner_id: winnerId,
        winner_score: winnerScore,
      }
    } catch (error) {
      console.error('❌ [SUBMIT_RESULT_ERROR]', error)
      console.log('='.repeat(80))
      throw error
    }
  }
}
