import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateCodingBattleDto } from '../dto/create-coding-battle.dto';

@Injectable()
export class CodingBattleService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createDto: CreateCodingBattleDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('coding_battle')
      .insert(createDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('coding_battle').select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('coding_battle')
      .select('*')
      .eq('battle_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findByChallengeId(challengeId: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('coding_battle')
      .select('*')
      .eq('challenge_id', challengeId)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, updateData: Partial<CreateCodingBattleDto>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('coding_battle')
      .update(updateData)
      .eq('battle_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('coding_battle')
      .delete()
      .eq('battle_id', id);

    if (error) throw error;
    return { message: 'Coding battle deleted successfully' };
  }
}

