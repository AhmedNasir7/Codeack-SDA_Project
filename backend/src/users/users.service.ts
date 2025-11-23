import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private supabaseService: SupabaseService) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`INSERT INTO users - Creating user: ${createUserDto.username || createUserDto.email}`);
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .insert(createUserDto)
      .select()
      .single();

    if (error) {
      this.logger.error(`SQL Error: ${error.message}`);
      throw error;
    }
    this.logger.log(`✓ User created successfully with ID: ${data.user_id}`);
    return data;
  }

  async findAll() {
    this.logger.log('SELECT * FROM users - Fetching all users');
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      this.logger.error(`SQL Error: ${error.message}`);
      throw error;
    }
    this.logger.log(`✓ Retrieved ${data?.length || 0} users`);
    return data;
  }

  async findOne(id: number) {
    this.logger.log(`SELECT * FROM users WHERE user_id = ${id}`);
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error) {
      this.logger.error(`SQL Error: ${error.message}`);
      throw error;
    }
    this.logger.log(`✓ User found: ${data?.username || data?.email || 'N/A'}`);
    return data;
  }

  async findByUsername(username: string) {
    this.logger.log(`SELECT * FROM users WHERE username = '${username}'`);
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      this.logger.error(`SQL Error: ${error.message}`);
      throw error;
    }
    this.logger.log(`✓ User found by username: ${username}`);
    return data;
  }

  async findByEmail(email: string) {
    this.logger.log(`SELECT * FROM users WHERE email = '${email}'`);
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      this.logger.error(`SQL Error: ${error.message}`);
      throw error;
    }
    this.logger.log(`✓ User found by email: ${email}`);
    return data;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    this.logger.log(`UPDATE users SET ... WHERE user_id = ${id}`);
    this.logger.debug(`Update data: ${JSON.stringify(updateUserDto)}`);
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .update(updateUserDto)
      .eq('user_id', id)
      .select()
      .single();

    if (error) {
      this.logger.error(`SQL Error: ${error.message}`);
      throw error;
    }
    this.logger.log(`✓ User updated successfully: ${id}`);
    return data;
  }

  async remove(id: number) {
    this.logger.log(`DELETE FROM users WHERE user_id = ${id}`);
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('user_id', id);

    if (error) {
      this.logger.error(`SQL Error: ${error.message}`);
      throw error;
    }
    this.logger.log(`✓ User deleted successfully: ${id}`);
    return { message: 'User deleted successfully' };
  }
}

