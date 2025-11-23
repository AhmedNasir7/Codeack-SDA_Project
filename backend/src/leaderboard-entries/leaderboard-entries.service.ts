import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateLeaderboardEntryDto } from '../dto/create-leaderboard-entry.dto';

@Injectable()
export class LeaderboardEntriesService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createDto: CreateLeaderboardEntryDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .insert(createDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select('*')
      .order('rank_position', { ascending: true });

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select('*')
      .eq('entry_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findByLeaderboardId(leaderboardId: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select('*')
      .eq('leaderboard_id', leaderboardId)
      .order('rank_position', { ascending: true });

    if (error) throw error;
    return data;
  }

  async findByUserId(userId: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select('*')
      .eq('user_id', userId)
      .order('rank_position', { ascending: true });

    if (error) throw error;
    return data;
  }

  async findByTeamId(teamId: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select('*')
      .eq('team_id', teamId)
      .order('rank_position', { ascending: true });

    if (error) throw error;
    return data;
  }

  async getTopN(leaderboardId: number, limit: number = 10) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select('*')
      .eq('leaderboard_id', leaderboardId)
      .order('rank_position', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async update(id: number, updateData: Partial<CreateLeaderboardEntryDto>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .update(updateData)
      .eq('entry_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('leaderboard_entries')
      .delete()
      .eq('entry_id', id);

    if (error) throw error;
    return { message: 'Leaderboard entry deleted successfully' };
  }
}

