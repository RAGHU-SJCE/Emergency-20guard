import { Database as SqliteDB } from 'sqlite';

export interface EmergencyEventData {
  id?: number;
  uuid: string;
  userId?: number;
  eventType: 'medical' | 'fire' | 'police' | 'general';
  status: 'active' | 'resolved' | 'cancelled';
  severity: 'low' | 'medium' | 'high' | 'critical';
  locationLatitude?: number;
  locationLongitude?: number;
  locationAccuracy?: number;
  locationAddress?: string;
  locationTimestamp?: Date;
  emergencyNumber?: string;
  callDuration?: number; // in seconds
  responseTime?: number; // in seconds
  notes?: string;
  systemInfo?: any; // JSON object with system information
  createdAt?: Date;
  updatedAt?: Date;
  resolvedAt?: Date;
}

export interface EmergencyEventFilter {
  userId?: number;
  eventType?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

export class EmergencyEventModel {
  private db: SqliteDB;

  constructor(database: SqliteDB) {
    this.db = database;
  }

  /**
   * Create a new emergency event
   */
  async create(eventData: EmergencyEventData): Promise<EmergencyEventData> {
    const query = `
      INSERT INTO emergency_events (
        uuid, user_id, event_type, status, severity,
        location_latitude, location_longitude, location_accuracy,
        location_address, location_timestamp, emergency_number,
        call_duration, response_time, notes, system_info
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      eventData.uuid,
      eventData.userId || null,
      eventData.eventType,
      eventData.status || 'active',
      eventData.severity || 'high',
      eventData.locationLatitude || null,
      eventData.locationLongitude || null,
      eventData.locationAccuracy || null,
      eventData.locationAddress || null,
      eventData.locationTimestamp?.toISOString() || null,
      eventData.emergencyNumber || null,
      eventData.callDuration || null,
      eventData.responseTime || null,
      eventData.notes || null,
      eventData.systemInfo ? JSON.stringify(eventData.systemInfo) : null
    ];

    const result = await this.db.run(query, params);
    
    if (result.lastID) {
      return await this.findById(result.lastID);
    }
    
    throw new Error('Failed to create emergency event');
  }

  /**
   * Find emergency event by ID
   */
  async findById(id: number): Promise<EmergencyEventData | null> {
    const query = `
      SELECT * FROM emergency_events WHERE id = ?
    `;
    
    const result = await this.db.get(query, [id]);
    return result ? this.mapRowToEvent(result) : null;
  }

  /**
   * Find emergency event by UUID
   */
  async findByUuid(uuid: string): Promise<EmergencyEventData | null> {
    const query = `
      SELECT * FROM emergency_events WHERE uuid = ?
    `;
    
    const result = await this.db.get(query, [uuid]);
    return result ? this.mapRowToEvent(result) : null;
  }

  /**
   * Find emergency events with filters
   */
  async findAll(filter: EmergencyEventFilter = {}): Promise<EmergencyEventData[]> {
    let query = `
      SELECT * FROM emergency_events WHERE 1=1
    `;
    const params: any[] = [];

    if (filter.userId) {
      query += ` AND user_id = ?`;
      params.push(filter.userId);
    }

    if (filter.eventType) {
      query += ` AND event_type = ?`;
      params.push(filter.eventType);
    }

    if (filter.status) {
      query += ` AND status = ?`;
      params.push(filter.status);
    }

    if (filter.dateFrom) {
      query += ` AND created_at >= ?`;
      params.push(filter.dateFrom.toISOString());
    }

    if (filter.dateTo) {
      query += ` AND created_at <= ?`;
      params.push(filter.dateTo.toISOString());
    }

    query += ` ORDER BY created_at DESC`;

    if (filter.limit) {
      query += ` LIMIT ?`;
      params.push(filter.limit);
    }

    if (filter.offset) {
      query += ` OFFSET ?`;
      params.push(filter.offset);
    }

    const results = await this.db.all(query, params);
    return results.map(this.mapRowToEvent);
  }

  /**
   * Update emergency event
   */
  async update(id: number, updates: Partial<EmergencyEventData>): Promise<EmergencyEventData | null> {
    const setClause: string[] = [];
    const params: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'uuid' && key !== 'createdAt') {
        const dbKey = this.camelToSnake(key);
        setClause.push(`${dbKey} = ?`);
        
        if (key === 'systemInfo' && value) {
          params.push(JSON.stringify(value));
        } else if (value instanceof Date) {
          params.push(value.toISOString());
        } else {
          params.push(value);
        }
      }
    });

    if (setClause.length === 0) {
      return await this.findById(id);
    }

    const query = `
      UPDATE emergency_events 
      SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    params.push(id);
    await this.db.run(query, params);
    
    return await this.findById(id);
  }

  /**
   * Delete emergency event
   */
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM emergency_events WHERE id = ?`;
    const result = await this.db.run(query, [id]);
    return (result.changes || 0) > 0;
  }

  /**
   * Get emergency event statistics
   */
  async getStatistics(userId?: number): Promise<any> {
    let baseQuery = `FROM emergency_events`;
    const params: any[] = [];
    
    if (userId) {
      baseQuery += ` WHERE user_id = ?`;
      params.push(userId);
    }

    const queries = {
      total: `SELECT COUNT(*) as count ${baseQuery}`,
      byType: `SELECT event_type, COUNT(*) as count ${baseQuery} GROUP BY event_type`,
      byStatus: `SELECT status, COUNT(*) as count ${baseQuery} GROUP BY status`,
      avgResponseTime: `SELECT AVG(response_time) as avg_time ${baseQuery} WHERE response_time IS NOT NULL`,
      recentEvents: `SELECT COUNT(*) as count ${baseQuery} AND created_at >= datetime('now', '-30 days')`
    };

    const results = await Promise.all([
      this.db.get(queries.total, params),
      this.db.all(queries.byType, params),
      this.db.all(queries.byStatus, params),
      this.db.get(queries.avgResponseTime, params),
      this.db.get(queries.recentEvents, params)
    ]);

    return {
      total: results[0]?.count || 0,
      byType: results[1] || [],
      byStatus: results[2] || [],
      averageResponseTime: results[3]?.avg_time || 0,
      recentEvents: results[4]?.count || 0
    };
  }

  /**
   * Map database row to EmergencyEventData
   */
  private mapRowToEvent(row: any): EmergencyEventData {
    return {
      id: row.id,
      uuid: row.uuid,
      userId: row.user_id,
      eventType: row.event_type,
      status: row.status,
      severity: row.severity,
      locationLatitude: row.location_latitude,
      locationLongitude: row.location_longitude,
      locationAccuracy: row.location_accuracy,
      locationAddress: row.location_address,
      locationTimestamp: row.location_timestamp ? new Date(row.location_timestamp) : undefined,
      emergencyNumber: row.emergency_number,
      callDuration: row.call_duration,
      responseTime: row.response_time,
      notes: row.notes,
      systemInfo: row.system_info ? JSON.parse(row.system_info) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      resolvedAt: row.resolved_at ? new Date(row.resolved_at) : undefined
    };
  }

  /**
   * Convert camelCase to snake_case
   */
  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

export default EmergencyEventModel;
