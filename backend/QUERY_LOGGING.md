# SQL Query Logging

SQL query logging has been enabled in your backend to help you see all database operations in the terminal.

## How It Works

When you make API calls that interact with the database, you'll see logs in your terminal showing:
- The SQL operation type (SELECT, INSERT, UPDATE, DELETE)
- The table name
- Query conditions (WHERE clauses)
- Success/error messages
- Result counts

## Example Output

When you make a request, you'll see logs like:

```
[UsersService] SELECT * FROM users - Fetching all users
[UsersService] ✓ Retrieved 5 users
```

Or for errors:
```
[UsersService] SELECT * FROM users WHERE user_id = 999
[UsersService] ✗ SQL Error: Row not found
```

## Current Status

✅ **UsersService** - Fully logged with query details
⚠️ **Other Services** - Can be updated similarly

## Adding Logging to Other Services

To add logging to other services, follow this pattern:

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class YourService {
  private readonly logger = new Logger(YourService.name);

  async findAll() {
    this.logger.log('SELECT * FROM your_table - Fetching all records');
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('your_table').select('*');

    if (error) {
      this.logger.error(`SQL Error: ${error.message}`);
      throw error;
    }
    this.logger.log(`✓ Retrieved ${data?.length || 0} records`);
    return data;
  }

  async findOne(id: number) {
    this.logger.log(`SELECT * FROM your_table WHERE id = ${id}`);
    // ... rest of your code
  }

  async create(dto: CreateDto) {
    this.logger.log(`INSERT INTO your_table - Creating record`);
    // ... rest of your code
    this.logger.log(`✓ Record created successfully with ID: ${data.id}`);
  }

  async update(id: number, dto: UpdateDto) {
    this.logger.log(`UPDATE your_table SET ... WHERE id = ${id}`);
    // ... rest of your code
  }

  async remove(id: number) {
    this.logger.log(`DELETE FROM your_table WHERE id = ${id}`);
    // ... rest of your code
  }
}
```

## Log Levels

The application is configured to show:
- `log` - General information (queries, success messages)
- `error` - Error messages
- `warn` - Warnings
- `debug` - Detailed debug information (when available)
- `verbose` - Very detailed information

## Testing

To see the logging in action:

1. Start your server: `npm run start:dev`
2. Make a request to any endpoint:
   ```bash
   curl http://localhost:3000/users
   ```
3. Check your terminal - you should see the SQL query logs!

## Notes

- Logs show the **PostgREST query** that Supabase generates (not raw SQL)
- The actual SQL executed by PostgreSQL may differ slightly
- All logs include timestamps and service names for easy tracking
- Error logs include error codes and messages for debugging

