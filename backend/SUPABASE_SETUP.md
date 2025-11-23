# Supabase Setup

Supabase has been successfully integrated into your NestJS backend!

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
SUPABASE_URL=https://ukyesvojadwtjabvgtir.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVreWVzdm9qYWR3dGphYnZndGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjgzMzUsImV4cCI6MjA3OTA0NDMzNX0.0LazX9qkxcyVInXWzgS9GGr7OfHUW5SPVO1lwtyxY-0
```

## Usage

The Supabase service is now available globally throughout your application. You can inject it into any service or controller:

```typescript
import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class YourService {
  constructor(private supabaseService: SupabaseService) {}

  async someMethod() {
    const supabase = this.supabaseService.getClient();
    
    // Example: Fetch data from a table
    const { data, error } = await supabase
      .from('your_table')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data;
  }
}
```

## Available Supabase Operations

With the Supabase client, you can:
- Query and manipulate database tables
- Handle authentication
- Manage storage buckets
- Use real-time subscriptions
- And more!

Refer to the [Supabase JavaScript Client documentation](https://supabase.com/docs/reference/javascript/introduction) for detailed usage.

