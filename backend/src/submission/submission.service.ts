import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateSubmissionDto } from '../dto/create-submission.dto';

@Injectable()
export class SubmissionService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createSubmissionDto: CreateSubmissionDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('submission')
      .insert(createSubmissionDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('submission').select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('submission')
      .select('*')
      .eq('submission_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findByStatus(status: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('submission')
      .select('*')
      .eq('status', status);

    if (error) throw error;
    return data;
  }

  async updateStatus(id: number, status: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('submission')
      .update({ status })
      .eq('submission_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('submission')
      .delete()
      .eq('submission_id', id);

    if (error) throw error;
    return { message: 'Submission deleted successfully' };
  }
}

