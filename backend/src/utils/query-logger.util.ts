import { Logger } from '@nestjs/common';

export class QueryLogger {
  private static logger = new Logger('SQL Query');

  static logQuery(
    operation: string,
    table: string,
    conditions?: Record<string, any>,
    data?: any,
  ) {
    const timestamp = new Date().toISOString();
    let query = `${operation.toUpperCase()} ${table}`;
    
    if (conditions && Object.keys(conditions).length > 0) {
      const whereClause = Object.entries(conditions)
        .map(([key, value]) => `${key} = ${typeof value === 'string' ? `'${value}'` : value}`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
    }

    if (data && (operation === 'INSERT' || operation === 'UPDATE')) {
      this.logger.debug(`Data: ${JSON.stringify(data)}`);
    }

    this.logger.log(`[${timestamp}] ${query}`);
  }

  static logSuccess(message: string, data?: any) {
    this.logger.log(`✓ ${message}`);
    if (data) {
      this.logger.debug(`Result: ${JSON.stringify(data, null, 2)}`);
    }
  }

  static logError(message: string, error: any) {
    this.logger.error(`✗ ${message}`);
    this.logger.error(`Error: ${error.message || error}`);
    if (error.code) {
      this.logger.error(`Error Code: ${error.code}`);
    }
  }
}

