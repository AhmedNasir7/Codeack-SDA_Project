import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Supabase URL and Anon Key must be provided in environment variables',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      db: {
        schema: 'public',
      },
      global: {
        headers: {},
      },
    });

    // Enable query logging
    this.logger.log('Supabase client initialized');
    this.logger.log(`Connected to: ${supabaseUrl}`);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Helper method to log queries
  logQuery(operation: string, table: string, details?: any) {
    const timestamp = new Date().toISOString();
    this.logger.log(`[${timestamp}] SQL Query: ${operation.toUpperCase()} on table: ${table}`);
    if (details) {
      this.logger.debug(`Query details: ${JSON.stringify(details, null, 2)}`);
    }
  }
}

