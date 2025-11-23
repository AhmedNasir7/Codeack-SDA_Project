import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateChallengeDto } from '../dto/create-challenge.dto';

@Injectable()
export class ChallengeService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createChallengeDto: CreateChallengeDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('challenge')
      .insert({
        ...createChallengeDto,
        allowed_languages: createChallengeDto.allowed_languages || [],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('challenge').select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('challenge')
      .select('*')
      .eq('challenge_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findByDifficulty(difficulty: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('challenge')
      .select('*')
      .eq('difficulty', difficulty);

    if (error) throw error;
    return data;
  }

  async update(id: number, updateData: Partial<CreateChallengeDto>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('challenge')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('challenge_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('challenge')
      .delete()
      .eq('challenge_id', id);

    if (error) throw error;
    return { message: 'Challenge deleted successfully' };
  }
}

