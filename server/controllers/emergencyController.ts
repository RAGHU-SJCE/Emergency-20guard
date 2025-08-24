import { Request, Response } from 'express';
import { EmergencyService } from '../services/emergencyService';
import { NotificationService } from '../services/notificationService';
import { LocationService } from '../services/locationService';
import { 
  EmergencyCallRequest, 
  EmergencyCallResponse, 
  ContactAlertRequest, 
  ContactAlertResponse 
} from '@shared/api';

export class EmergencyController {
  private emergencyService: EmergencyService;
  private notificationService: NotificationService;
  private locationService: LocationService;

  constructor(
    emergencyService: EmergencyService,
    notificationService: NotificationService,
    locationService: LocationService
  ) {
    this.emergencyService = emergencyService;
    this.notificationService = notificationService;
    this.locationService = locationService;
  }

  /**
   * Handle emergency call initiation
   */
  initiateEmergencyCall = async (req: Request, res: Response): Promise<void> => {
    try {
      const emergencyData: EmergencyCallRequest = req.body;
      const userIp = req.ip || req.connection.remoteAddress || 'unknown';

      // Validate request
      if (!emergencyData.emergencyType) {
        res.status(400).json({
          success: false,
          callId: '',
          message: 'Emergency type is required',
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Create emergency event
      const emergencyEvent = await this.emergencyService.createEmergencyEvent({
        emergencyType: emergencyData.emergencyType,
        location: emergencyData.location,
        userInfo: emergencyData.userInfo,
        userIp: userIp,
        timestamp: emergencyData.timestamp
      });

      // Determine emergency number based on location/type
      const emergencyNumber = this.emergencyService.getEmergencyNumber(
        emergencyData.emergencyType,
        emergencyData.location
      );

      // Log the emergency call attempt
      await this.emergencyService.logEmergencyCall({
        eventId: emergencyEvent.uuid,
        emergencyNumber,
        callInitiated: true,
        userIp: userIp
      });

      // Prepare response
      const response: EmergencyCallResponse = {
        success: true,
        callId: emergencyEvent.uuid,
        message: 'Emergency call initiated successfully. Location shared with emergency services.',
        emergencyNumber,
        location: emergencyData.location,
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);

      // Background tasks (don't wait for these)
      this.handleBackgroundEmergencyTasks(emergencyEvent, emergencyData);

    } catch (error) {
      console.error('Emergency call controller error:', error);
      res.status(500).json({
        success: false,
        callId: '',
        message: 'Failed to initiate emergency call. Please call 911 directly.',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Handle emergency contact alerts
   */
  alertEmergencyContacts = async (req: Request, res: Response): Promise<void> => {
    try {
      const alertData: ContactAlertRequest = req.body;

      // Validate request
      if (!alertData.contacts || alertData.contacts.length === 0) {
        res.status(400).json({
          success: false,
          alertId: '',
          contactsNotified: 0,
          failedContacts: [],
          message: 'No emergency contacts provided'
        });
        return;
      }

      // Create alert record
      const alertRecord = await this.emergencyService.createContactAlert({
        contacts: alertData.contacts,
        message: alertData.message,
        emergencyType: alertData.emergencyType,
        location: alertData.location
      });

      // Send notifications to contacts
      const notificationResults = await this.notificationService.sendEmergencyAlerts({
        alertId: alertRecord.id,
        contacts: alertData.contacts,
        message: alertData.message,
        location: alertData.location,
        emergencyType: alertData.emergencyType
      });

      // Count successes and failures
      const contactsNotified = notificationResults.filter(r => r.success).length;
      const failedContacts = notificationResults
        .filter(r => !r.success)
        .map(r => r.contactName);

      const response: ContactAlertResponse = {
        success: true,
        alertId: alertRecord.id,
        contactsNotified,
        failedContacts,
        message: `Successfully alerted ${contactsNotified} of ${alertData.contacts.length} emergency contacts.`
      };

      res.status(200).json(response);

    } catch (error) {
      console.error('Emergency contact alert error:', error);
      res.status(500).json({
        success: false,
        alertId: '',
        contactsNotified: 0,
        failedContacts: [],
        message: 'Failed to alert emergency contacts.'
      });
    }
  };

  /**
   * Log emergency event
   */
  logEmergencyEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const eventData = req.body;
      
      const logEntry = await this.emergencyService.logEvent({
        ...eventData,
        userIp: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown'
      });

      res.status(200).json({
        success: true,
        eventId: logEntry.id,
        message: 'Emergency event logged successfully.',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Event logging error:', error);
      res.status(500).json({
        success: false,
        eventId: '',
        message: 'Failed to log emergency event.'
      });
    }
  };

  /**
   * Get emergency history
   */
  getEmergencyHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, limit = 50, offset = 0 } = req.query;

      const history = await this.emergencyService.getEmergencyHistory({
        userId: userId ? Number(userId) : undefined,
        limit: Number(limit),
        offset: Number(offset)
      });

      res.status(200).json({
        success: true,
        history: history.events,
        total: history.total,
        limit: Number(limit),
        offset: Number(offset)
      });

    } catch (error) {
      console.error('Emergency history fetch error:', error);
      res.status(500).json({
        success: false,
        history: [],
        total: 0,
        message: 'Failed to fetch emergency history.'
      });
    }
  };

  /**
   * Get emergency statistics
   */
  getEmergencyStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.query;

      const stats = await this.emergencyService.getStatistics(
        userId ? Number(userId) : undefined
      );

      res.status(200).json({
        success: true,
        statistics: stats
      });

    } catch (error) {
      console.error('Emergency statistics error:', error);
      res.status(500).json({
        success: false,
        statistics: null,
        message: 'Failed to fetch emergency statistics.'
      });
    }
  };

  /**
   * Handle system health check
   */
  healthCheck = async (req: Request, res: Response): Promise<void> => {
    try {
      const health = await this.emergencyService.checkSystemHealth();
      
      res.status(health.healthy ? 200 : 503).json({
        healthy: health.healthy,
        timestamp: new Date().toISOString(),
        services: health.services,
        uptime: process.uptime()
      });

    } catch (error) {
      console.error('Health check error:', error);
      res.status(503).json({
        healthy: false,
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      });
    }
  };

  /**
   * Handle background tasks after emergency call
   */
  private async handleBackgroundEmergencyTasks(
    emergencyEvent: any, 
    emergencyData: EmergencyCallRequest
  ): Promise<void> {
    try {
      // Reverse geocode location if coordinates provided
      if (emergencyData.location) {
        const address = await this.locationService.reverseGeocode(
          emergencyData.location.latitude,
          emergencyData.location.longitude
        );
        
        if (address) {
          await this.emergencyService.updateEventLocation(
            emergencyEvent.uuid,
            { ...emergencyData.location, address }
          );
        }
      }

      // Log system information
      await this.emergencyService.logSystemInfo(emergencyEvent.uuid, {
        userAgent: emergencyData.userInfo || {},
        timestamp: emergencyData.timestamp,
        emergencyType: emergencyData.emergencyType
      });

    } catch (error) {
      console.error('Background emergency tasks error:', error);
      // Don't throw - these are non-critical background tasks
    }
  }
}

export default EmergencyController;
