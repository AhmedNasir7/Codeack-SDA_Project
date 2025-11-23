import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {
  constructor(private supabaseService: SupabaseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async testDatabaseConnection() {
    try {
      const supabase = this.supabaseService.getClient();
      
      // Test connection by making a simple query to verify Supabase is accessible
      // We'll use a query that works even if tables don't exist yet
      const { data, error } = await supabase
        .from('_test_connection')
        .select('*')
        .limit(1);

      // If we get a PGRST116 error, it means the table doesn't exist but connection works
      // If we get PGRST205, it means the schema cache issue but connection is working
      // Both indicate that Supabase is reachable and responding
      if (error) {
        // Connection is working if we get a structured error from Supabase
        // PGRST116 = table not found (connection OK)
        // PGRST205 = schema cache issue (connection OK)
        if (error.code === 'PGRST116' || error.code === 'PGRST205') {
          return {
            success: true,
            message: 'Supabase connection successful!',
            status: 'connected',
            details: 'Database is reachable and responding. The test table does not exist, which is expected.',
            supabaseUrl: process.env.SUPABASE_URL || 'configured',
            timestamp: new Date().toISOString(),
          };
        }
        
        // Other errors might indicate connection issues
        return {
          success: false,
          message: 'Database connection error',
          error: error.message,
          code: error.code,
          timestamp: new Date().toISOString(),
        };
      }

      // If no error, connection is definitely working
      return {
        success: true,
        message: 'Database connection successful',
        status: 'connected',
        data: data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to connect to database',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
