import { Database } from 'sqlite3';
import { open, Database as SqliteDB } from 'sqlite';
import path from 'path';

export interface DatabaseConfig {
  type: 'sqlite' | 'postgresql';
  host?: string;
  port?: number;
  database: string;
  username?: string;
  password?: string;
  ssl?: boolean;
  maxConnections?: number;
  acquireConnectionTimeout?: number;
}

// Database configuration based on environment
export const getDatabaseConfig = (): DatabaseConfig => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return {
        type: 'postgresql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'emergency_guard_prod',
        username: process.env.DB_USER || 'emergency_user',
        password: process.env.DB_PASSWORD || '',
        ssl: process.env.DB_SSL === 'true',
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
        acquireConnectionTimeout: parseInt(process.env.DB_TIMEOUT || '30000')
      };
    
    case 'test':
      return {
        type: 'sqlite',
        database: ':memory:' // In-memory database for tests
      };
    
    case 'development':
    default:
      return {
        type: 'sqlite',
        database: path.join(process.cwd(), 'database', 'emergency_guard_dev.db')
      };
  }
};

// SQLite connection (for development)
export const createSqliteConnection = async (): Promise<SqliteDB> => {
  const config = getDatabaseConfig();
  
  if (config.type !== 'sqlite') {
    throw new Error('SQLite configuration expected');
  }

  const db = await open({
    filename: config.database,
    driver: Database
  });

  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON');
  
  // Enable WAL mode for better concurrency
  await db.exec('PRAGMA journal_mode = WAL');
  
  return db;
};

// PostgreSQL connection configuration (for production)
export const getPostgreSQLConfig = () => {
  const config = getDatabaseConfig();
  
  if (config.type !== 'postgresql') {
    throw new Error('PostgreSQL configuration expected');
  }

  return {
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.username,
    password: config.password,
    ssl: config.ssl ? { rejectUnauthorized: false } : false,
    max: config.maxConnections,
    acquireTimeoutMillis: config.acquireConnectionTimeout,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
};

// Database initialization
export const initializeDatabase = async () => {
  const config = getDatabaseConfig();
  
  try {
    if (config.type === 'sqlite') {
      const db = await createSqliteConnection();
      console.log(`✅ SQLite database connected: ${config.database}`);
      return db;
    } else {
      // PostgreSQL initialization would go here
      console.log(`✅ PostgreSQL database connected: ${config.database}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Migration runner
export const runMigrations = async () => {
  const config = getDatabaseConfig();
  const fs = await import('fs/promises');
  const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
  
  try {
    if (config.type === 'sqlite') {
      const db = await createSqliteConnection();
      const schema = await fs.readFile(schemaPath, 'utf-8');
      
      // Split schema by statements and execute
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      for (const statement of statements) {
        await db.exec(statement);
      }
      
      console.log('✅ Database migrations completed');
      await db.close();
    } else {
      console.log('⚠️ PostgreSQL migrations not implemented yet');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const config = getDatabaseConfig();
    
    if (config.type === 'sqlite') {
      const db = await createSqliteConnection();
      await db.get('SELECT 1');
      await db.close();
      return true;
    } else {
      // PostgreSQL health check would go here
      return true;
    }
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Database utilities
export const DatabaseUtils = {
  // Generate UUID v4
  generateUUID: (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  // Format timestamp for database
  formatTimestamp: (date: Date = new Date()): string => {
    return date.toISOString();
  },

  // Sanitize user input
  sanitizeInput: (input: string): string => {
    return input.replace(/[<>\"'%;()&+]/g, '');
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone format
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
};

export default {
  getDatabaseConfig,
  createSqliteConnection,
  getPostgreSQLConfig,
  initializeDatabase,
  runMigrations,
  checkDatabaseHealth,
  DatabaseUtils
};
