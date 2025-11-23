import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createPortfolioDto: CreatePortfolioDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('portfolio')
      .insert(createPortfolioDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('portfolio').select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('portfolio_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: number, updateData: Partial<CreatePortfolioDto>) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('portfolio')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('portfolio_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async incrementSolvedQuestions(id: number, increment: number = 1) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.rpc('increment_solved', {
      portfolio_id: id,
      increment_value: increment,
    });

    if (error) {
      // Fallback to manual update if RPC doesn't exist
      const portfolio = await this.findOne(id);
      return this.update(id, {
        solved_questions: (portfolio.solved_questions || 0) + increment,
      });
    }

    return data;
  }

  async addScore(id: number, score: number) {
    const supabase = this.supabaseService.getClient();
    const portfolio = await this.findOne(id);
    return this.update(id, {
      total_score: (portfolio.total_score || 0) + score,
    });
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('portfolio')
      .delete()
      .eq('portfolio_id', id);

    if (error) throw error;
    return { message: 'Portfolio deleted successfully' };
  }
}

