import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateBugFixingChallengeDto } from '../dto/create-bug-fixing-challenge.dto';

@Injectable()
export class BugFixingChallengeService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createDto: CreateBugFixingChallengeDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('bug_fixing_challenge')
      .insert(createDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('bug_fixing_challenge')
      .select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('bug_fixing_challenge')
      .select('*')
      .eq('bug_fix_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findByChallengeId(challengeId: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('bug_fixing_challenge')
      .select('*')
      .eq('challenge_id', challengeId)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, updateData: Partial<CreateBugFixingChallengeDto>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('bug_fixing_challenge')
      .update(updateData)
      .eq('bug_fix_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('bug_fixing_challenge')
      .delete()
      .eq('bug_fix_id', id);

    if (error) throw error;
    return { message: 'Bug fixing challenge deleted successfully' };
  }
}

