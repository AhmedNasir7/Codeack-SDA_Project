import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateTeamDto } from '../dto/create-team.dto';

@Injectable()
export class TeamService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createTeamDto: CreateTeamDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('team')
      .insert(createTeamDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('team').select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('team')
      .select('*')
      .eq('team_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, updateData: Partial<CreateTeamDto>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('team')
      .update(updateData)
      .eq('team_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async incrementMemberCount(id: number, increment: number = 1) {
    const team = await this.findOne(id);
    return this.update(id, {
      member_count: (team.member_count || 0) + increment,
    });
  }

  async addScore(id: number, score: number) {
    const team = await this.findOne(id);
    return this.update(id, {
      total_score: (team.total_score || 0) + score,
    });
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from('team').delete().eq('team_id', id);

    if (error) throw error;
    return { message: 'Team deleted successfully' };
  }
}

