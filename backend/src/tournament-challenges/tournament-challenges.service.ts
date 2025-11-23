import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateTournamentChallengeDto } from '../dto/create-tournament-challenge.dto';

@Injectable()
export class TournamentChallengesService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createDto: CreateTournamentChallengeDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('tournament_challenges')
      .insert(createDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('tournament_challenges')
      .select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('tournament_challenges')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findByTournamentId(tournamentId: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('tournament_challenges')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('order_number', { ascending: true });

    if (error) throw error;
    return data;
  }

  async findByChallengeId(challengeId: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('tournament_challenges')
      .select('*')
      .eq('challenge_id', challengeId);

    if (error) throw error;
    return data;
  }

  async update(id: number, updateData: Partial<CreateTournamentChallengeDto>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('tournament_challenges')
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
      .from('tournament_challenges')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Tournament challenge removed successfully' };
  }
}

