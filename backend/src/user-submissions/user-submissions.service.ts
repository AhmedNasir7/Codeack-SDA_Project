import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUserSubmissionDto } from '../dto/create-user-submission.dto';

@Injectable()
export class UserSubmissionsService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createDto: CreateUserSubmissionDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('user_submissions')
      .insert(createDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('user_submissions')
      .select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('user_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findByUserId(userId: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('user_submissions')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  async findByChallengeId(challengeId: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('user_submissions')
      .select('*')
      .eq('challenge_id', challengeId);

    if (error) throw error;
    return data;
  }

  async findByUserAndChallenge(userId: number, challengeId: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('user_submissions')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_id', challengeId);

    if (error) throw error;
    return data;
  }

  async update(id: number, updateData: Partial<CreateUserSubmissionDto>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('user_submissions')
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
      .from('user_submissions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'User submission deleted successfully' };
  }
}

