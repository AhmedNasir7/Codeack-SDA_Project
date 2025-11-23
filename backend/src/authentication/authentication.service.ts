import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAuthenticationDto } from '../dto/create-authentication.dto';

@Injectable()
export class AuthenticationService {
  constructor(private supabaseService: SupabaseService) {}

  async create(createAuthDto: CreateAuthenticationDto) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('authentication')
      .insert(createAuthDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('authentication').select('*');

    if (error) throw error;
    return data;
  }

  async findOne(id: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('authentication')
      .select('*')
      .eq('auth_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async findByUsername(username: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('authentication')
      .select('*')
      .eq('username', username)
      .single();

    if (error) throw error;
    return data;
  }

  async findByEmail(email: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('authentication')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  }

  async updateLastLogin(id: number) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('authentication')
      .update({ last_login: new Date().toISOString() })
      .eq('auth_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateActiveStatus(id: number, isActive: boolean) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('authentication')
      .update({ is_active: isActive })
      .eq('auth_id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('authentication')
      .delete()
      .eq('auth_id', id);

    if (error) throw error;
    return { message: 'Authentication record deleted successfully' };
  }
}

