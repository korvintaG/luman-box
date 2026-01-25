import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class DatabaseSetupService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSetupService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await this.createFunctions();
  }

  private async createFunctions() {
    try {
      this.logger.log('Starting database functions setup...');

      // Determine functions directory based on environment
      // In production/build: use dist/databases/functions
      // In development: use src/databases/functions
      const functionsDir = __dirname.includes('dist')
        ? join(process.cwd(), 'dist', 'databases', 'functions')
        : join(process.cwd(), 'src', 'databases', 'functions');
      
      // Get all .sql files from the directory
      const sqlFiles = readdirSync(functionsDir)
        .filter(file => file.endsWith('.sql'))
        .map(file => file.replace('.sql', ''));

      if (sqlFiles.length === 0) {
        this.logger.warn('No SQL files found in functions directory');
        return;
      }

      this.logger.log(`Found ${sqlFiles.length} SQL function(s) to create`);

      for (const funcName of sqlFiles) {
        try {
          const functionPath = join(functionsDir, `${funcName}.sql`);
          this.logger.debug(`Reading function from: ${functionPath}`);
          
          const functionSQL = readFileSync(functionPath, 'utf8');
          await this.dataSource.query(functionSQL);
          
          this.logger.log(`✓ Function ${funcName} created successfully`);
        } catch (error) {
          this.logger.error(`Failed to create function ${funcName}:`, error.message);
          // Continue with other functions even if one fails
        }
      }

      this.logger.log('Database functions setup completed');
    } catch (error) {
      this.logger.error('Database functions setup failed:', error.message);
    }
  }
}
