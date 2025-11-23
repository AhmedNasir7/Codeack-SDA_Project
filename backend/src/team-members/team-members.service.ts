import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateTeamMemberDto } from '../dto/create-team-member.dto';

@Injectable()
export class TeamMembersService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createDto: CreateTeamMemberDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('team_members')
      .insert(createDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('team_members').select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findByTeamId(teamId: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId);

    if (error) throw error;
    return data;
  }

  async findByUserId(userId: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  async update(id: number, updateData: Partial<CreateTeamMemberDto>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('team_members')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from('team_members').delete().eq('id', id);

    if (error) throw error;
    return { message: 'Team member removed successfully' };
  }

  async removeByTeamAndUser(teamId: number, userId: number) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);

    if (error) throw error;
    return { message: 'Team member removed successfully' };
  }
}

