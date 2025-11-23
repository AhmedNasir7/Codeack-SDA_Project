import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateTournamentParticipantDto } from '../dto/create-tournament-participant.dto';

@Injectable()
export class TournamentParticipantsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createDto: CreateTournamentParticipantDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('tournament_participants')
      .insert(createDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('tournament_participants')
      .select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('tournament_participants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findByTournamentId(tournamentId: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('tournament_participants')
      .select('*')
      .eq('tournament_id', tournamentId);

    if (error) throw error;
    return data;
  }

  async findByUserId(userId: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('tournament_participants')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  async update(id: number, updateData: Partial<CreateTournamentParticipantDto>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('tournament_participants')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('tournament_participants')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Tournament participant removed successfully' };
  }
}

