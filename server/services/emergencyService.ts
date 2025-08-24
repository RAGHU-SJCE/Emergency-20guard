import { EmergencyEventModel, EmergencyEventData } from '../models/EmergencyEvent';
import { Database as SqliteDB } from 'sqlite';

export interface EmergencyLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

export interface EmergencyContact {
  name: string;
  phone?: string;
  email?: string;
  relationship: string;
}

export interface CreateEmergencyEventOptions {
  emergencyType: 'medical' | 'fire' | 'police' | 'general';
  location?: EmergencyLocation;
  userInfo?: {
    name?: string;
    phone?: string;
    medicalInfo?: string;
  };
  userIp?: string;
  timestamp: string;
}

export interface ContactAlertOptions {
  contacts: EmergencyContact[];
  message: string;
  emergencyType: string;
  location?: EmergencyLocation;
}

export interface EmergencyHistoryFilter {
  userId?: number;
  limit?: number;
  offset?: number;
  dateFrom?: Date;
  dateTo?: Date;
  eventType?: string;
  status?: string;
}

export class EmergencyService {
  private emergencyEventModel: EmergencyEventModel;
  private db: SqliteDB;

  constructor(database: SqliteDB) {
    this.db = database;
    this.emergencyEventModel = new EmergencyEventModel(database);
  }

  /**
   * Create a new emergency event
   */
  async createEmergencyEvent(options: CreateEmergencyEventOptions): Promise<EmergencyEventData> {
    const eventData: EmergencyEventData = {
      uuid: this.generateUUID(),
      eventType: options.emergencyType,
      status: 'active',
      severity: this.determineSeverity(options.emergencyType),
      locationLatitude: options.location?.latitude,
      locationLongitude: options.location?.longitude,
      locationAccuracy: options.location?.accuracy,
      locationAddress: options.location?.address,
      locationTimestamp: new Date(),
      systemInfo: {
        userAgent: options.userInfo || {},
        userIp: options.userIp,
        timestamp: options.timestamp,
        appVersion: process.env.APP_VERSION || '1.0.0'
      }
    };

    const createdEvent = await this.emergencyEventModel.create(eventData);
    
    // Log audit entry
    await this.logAuditEntry({
      action: 'emergency_call_created',
      resourceType: 'emergency_event',
      resourceId: createdEvent.uuid,
      details: {
        emergencyType: options.emergencyType,
        hasLocation: !!options.location,
        userIp: options.userIp
      },
      severity: 'critical'
    });

    return createdEvent;
  }

  /**
   * Create contact alert record
   */
  async createContactAlert(options: ContactAlertOptions): Promise<{ id: string; timestamp: Date }> {
    const alertId = this.generateUUID();
    const timestamp = new Date();

    // In a production app, this would create a record in a contact_alerts table
    // For now, we'll log it as an audit entry
    await this.logAuditEntry({
      action: 'emergency_contacts_alerted',
      resourceType: 'contact_alert',
      resourceId: alertId,
      details: {
        contactCount: options.contacts.length,
        emergencyType: options.emergencyType,
        hasLocation: !!options.location,
        messageLength: options.message.length
      },
      severity: 'critical'
    });

    return { id: alertId, timestamp };
  }

  /**
   * Log emergency call attempt
   */
  async logEmergencyCall(options: {
    eventId: string;
    emergencyNumber: string;
    callInitiated: boolean;
    userIp: string;
  }): Promise<void> {
    await this.logAuditEntry({
      action: 'emergency_call_initiated',
      resourceType: 'emergency_call',
      resourceId: options.eventId,
      details: {
        emergencyNumber: options.emergencyNumber,
        callInitiated: options.callInitiated,
        userIp: options.userIp,
        timestamp: new Date().toISOString()
      },
      severity: 'critical'
    });
  }

  /**
   * Log general emergency event
   */
  async logEvent(eventData: any): Promise<{ id: string }> {
    const eventId = this.generateUUID();
    
    await this.logAuditEntry({
      action: 'emergency_event_logged',
      resourceType: 'emergency_event',
      resourceId: eventId,
      details: eventData,
      severity: 'info'
    });

    return { id: eventId };
  }

  /**
   * Get emergency history
   */
  async getEmergencyHistory(filter: EmergencyHistoryFilter = {}): Promise<{
    events: any[];
    total: number;
  }> {
    const events = await this.emergencyEventModel.findAll({
      userId: filter.userId,
      eventType: filter.eventType,
      status: filter.status,
      dateFrom: filter.dateFrom,
      dateTo: filter.dateTo,
      limit: filter.limit || 50,
      offset: filter.offset || 0
    });

    // Convert to API format
    const formattedEvents = events.map(event => ({
      id: event.uuid,
      type: this.formatEventType(event.eventType),
      date: event.createdAt?.toISOString().split('T')[0] || '',
      time: event.createdAt?.toTimeString().substring(0, 5) || '',
      location: {
        latitude: event.locationLatitude || 0,
        longitude: event.locationLongitude || 0,
        address: event.locationAddress || `${event.locationLatitude}, ${event.locationLongitude}`
      },
      status: this.capitalizeFirst(event.status),
      responseTime: event.responseTime ? this.formatResponseTime(event.responseTime) : 'N/A',
      contacts: ['Emergency Services'], // In production, get from notifications table
      notes: event.notes || `${this.formatEventType(event.eventType)} emergency call initiated via EmergencyGuard app.`,
      emergencyNumber: event.emergencyNumber,
      callId: event.uuid
    }));

    return {
      events: formattedEvents,
      total: formattedEvents.length
    };
  }

  /**
   * Get emergency statistics
   */
  async getStatistics(userId?: number): Promise<any> {
    return await this.emergencyEventModel.getStatistics(userId);
  }

  /**
   * Update event location with address
   */
  async updateEventLocation(eventUuid: string, location: EmergencyLocation): Promise<void> {
    const event = await this.emergencyEventModel.findByUuid(eventUuid);
    if (event) {
      await this.emergencyEventModel.update(event.id!, {
        locationAddress: location.address,
        locationLatitude: location.latitude,
        locationLongitude: location.longitude,
        locationAccuracy: location.accuracy
      });
    }
  }

  /**
   * Log system information for an event
   */
  async logSystemInfo(eventUuid: string, systemInfo: any): Promise<void> {
    const event = await this.emergencyEventModel.findByUuid(eventUuid);
    if (event) {
      const updatedSystemInfo = {
        ...event.systemInfo,
        ...systemInfo,
        updatedAt: new Date().toISOString()
      };
      
      await this.emergencyEventModel.update(event.id!, {
        systemInfo: updatedSystemInfo
      });
    }
  }

  /**
   * Check system health
   */
  async checkSystemHealth(): Promise<{
    healthy: boolean;
    services: { [key: string]: boolean };
  }> {
    const services: { [key: string]: boolean } = {};

    try {
      // Check database connectivity
      await this.db.get('SELECT 1');
      services.database = true;
    } catch (error) {
      services.database = false;
    }

    // Check if we can create UUID (basic functionality test)
    try {
      const uuid = this.generateUUID();
      services.core_functionality = uuid.length === 36;
    } catch (error) {
      services.core_functionality = false;
    }

    const healthy = Object.values(services).every(status => status);

    return { healthy, services };
  }

  /**
   * Get emergency number based on emergency type and location
   */
  getEmergencyNumber(emergencyType: string, location?: EmergencyLocation): string {
    // In a production app, this would determine based on geolocation
    // For now, default to US emergency services
    
    switch (emergencyType) {
      case 'police':
        return '911';
      case 'fire':
        return '911';
      case 'medical':
        return '911';
      default:
        return '911';
    }
  }

  /**
   * Determine emergency severity based on type
   */
  private determineSeverity(emergencyType: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (emergencyType) {
      case 'medical':
        return 'critical';
      case 'fire':
        return 'critical';
      case 'police':
        return 'high';
      default:
        return 'high';
    }
  }

  /**
   * Log audit entry
   */
  private async logAuditEntry(entry: {
    action: string;
    resourceType: string;
    resourceId: string;
    details: any;
    severity: string;
  }): Promise<void> {
    try {
      const query = `
        INSERT INTO audit_log (
          action, resource_type, resource_id, details, severity
        ) VALUES (?, ?, ?, ?, ?)
      `;
      
      await this.db.run(query, [
        entry.action,
        entry.resourceType,
        entry.resourceId,
        JSON.stringify(entry.details),
        entry.severity
      ]);
    } catch (error) {
      console.error('Failed to log audit entry:', error);
      // Don't throw - audit logging should not break main functionality
    }
  }

  /**
   * Generate UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Format event type for display
   */
  private formatEventType(eventType: string): string {
    switch (eventType) {
      case 'medical':
        return 'Medical Emergency';
      case 'fire':
        return 'Fire Emergency';
      case 'police':
        return 'Police Emergency';
      default:
        return 'General Emergency';
    }
  }

  /**
   * Format response time in MM:SS format
   */
  private formatResponseTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Capitalize first letter
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export default EmergencyService;
