import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateLeaderboardDto } from '../dto/create-leaderboard.dto';

@Injectable()
export class LeaderboardService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createLeaderboardDto: CreateLeaderboardDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('leaderboard')
      .insert(createLeaderboardDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('leaderboard').select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('leaderboard_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, updateData: Partial<CreateLeaderboardDto>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('leaderboard')
      .update({
        ...updateData,
        last_updated: new Date().toISOString(),
      })
      .eq('leaderboard_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('leaderboard')
      .delete()
      .eq('leaderboard_id', id);

    if (error) throw error;
    return { message: 'Leaderboard deleted successfully' };
  }
}

