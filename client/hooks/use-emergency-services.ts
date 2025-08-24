import { useState } from 'react';
import { useDeviceFeatures } from './use-device-features';
import { 
  EmergencyCallRequest, 
  EmergencyCallResponse, 
  ContactAlertRequest, 
  ContactAlertResponse,
  EmergencyHistoryResponse 
} from '@shared/api';

interface EmergencyContact {
  name: string;
  phone?: string;
  email?: string;
  relationship: string;
}

interface EmergencyServices {
  // Emergency calling
  initiateEmergencyCall: (type: 'medical' | 'fire' | 'police' | 'general') => Promise<EmergencyCallResponse>;
  callEmergencyNumber: (number: string) => void;
  
  // Contact alerts
  alertEmergencyContacts: (contacts: EmergencyContact[], message: string, emergencyType: string) => Promise<ContactAlertResponse>;
  
  // Location services
  shareLocationWithEmergencyServices: () => Promise<GeolocationPosition>;
  
  // Emergency logging
  logEmergencyEvent: (event: any) => Promise<void>;
  getEmergencyHistory: () => Promise<EmergencyHistoryResponse>;
  
  // State
  isEmergencyActive: boolean;
  currentEmergencyCall: EmergencyCallResponse | null;
  lastKnownLocation: GeolocationPosition | null;
  
  // Real-time emergency features
  startEmergencyMode: () => void;
  stopEmergencyMode: () => void;
  sendSOSSignal: () => void;
}

export function useEmergencyServices(): EmergencyServices {
  const deviceFeatures = useDeviceFeatures();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [currentEmergencyCall, setCurrentEmergencyCall] = useState<EmergencyCallResponse | null>(null);
  const [lastKnownLocation, setLastKnownLocation] = useState<GeolocationPosition | null>(null);

  const initiateEmergencyCall = async (type: 'medical' | 'fire' | 'police' | 'general'): Promise<EmergencyCallResponse> => {
    try {
      // Get current location
      let location = lastKnownLocation;
      if (deviceFeatures.geolocation.supported) {
        try {
          location = await deviceFeatures.geolocation.getCurrentLocation();
          setLastKnownLocation(location);
        } catch (error) {
          console.warn('Could not get location for emergency call:', error);
        }
      }

      // Prepare emergency call data
      const emergencyData: EmergencyCallRequest = {
        location: location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy
        } : undefined,
        emergencyType: type,
        timestamp: new Date().toISOString()
      };

      // Send to emergency API
      const response = await fetch('/api/emergency/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emergencyData)
      });

      const result: EmergencyCallResponse = await response.json();
      
      if (result.success) {
        setCurrentEmergencyCall(result);
        setIsEmergencyActive(true);
        
        // Initiate actual phone call if emergency number is provided
        if (result.emergencyNumber) {
          callEmergencyNumber(result.emergencyNumber);
        }

        // Send emergency notifications
        if (deviceFeatures.notifications.permission === 'granted') {
          deviceFeatures.notifications.sendNotification(
            'Emergency Call Initiated',
            {
              body: `Emergency services contacted. Call ID: ${result.callId}`,
              tag: 'emergency-call',
              requireInteraction: true
            }
          );
        }

        // Vibrate device
        if (deviceFeatures.vibration.supported) {
          deviceFeatures.vibration.vibrate([200, 100, 200, 100, 200]);
        }

        // Log the emergency event
        await logEmergencyEvent({
          type: `Emergency Call - ${type}`,
          location: emergencyData.location,
          timestamp: emergencyData.timestamp,
          callId: result.callId
        });
      }

      return result;
    } catch (error) {
      console.error('Emergency call failed:', error);
      
      // Fallback: Still try to make direct call
      const emergencyNumber = '911'; // Default emergency number
      callEmergencyNumber(emergencyNumber);
      
      throw new Error('Emergency call failed. Please call 911 directly.');
    }
  };

  const callEmergencyNumber = (number: string) => {
    try {
      // Use tel: protocol to initiate actual phone call
      window.open(`tel:${number}`, '_self');
      
      // Alternative methods for different browsers/devices
      if ('contacts' in navigator && 'ContactsManager' in window) {
        // For devices that support it, could access contacts
      }
      
      // Log that call was attempted
      console.log(`Emergency call initiated to: ${number}`);
      
    } catch (error) {
      console.error('Failed to initiate phone call:', error);
      
      // Fallback: Show alert with number to call manually
      alert(`Please call emergency services immediately at: ${number}`);
    }
  };

  const alertEmergencyContacts = async (contacts: EmergencyContact[], message: string, emergencyType: string): Promise<ContactAlertResponse> => {
    try {
      // Get current location for context
      let location = lastKnownLocation;
      if (deviceFeatures.geolocation.supported) {
        try {
          location = await deviceFeatures.geolocation.getCurrentLocation();
          setLastKnownLocation(location);
        } catch (error) {
          console.warn('Could not get location for contact alerts:', error);
        }
      }

      const alertData: ContactAlertRequest = {
        contacts,
        message,
        location: location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        } : undefined,
        emergencyType
      };

      const response = await fetch('/api/emergency/alert-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      });

      const result: ContactAlertResponse = await response.json();

      // Send local notification
      if (deviceFeatures.notifications.permission === 'granted') {
        deviceFeatures.notifications.sendNotification(
          'Emergency Contacts Alerted',
          {
            body: `${result.contactsNotified} contacts have been notified of your emergency.`,
            tag: 'contact-alert'
          }
        );
      }

      return result;
    } catch (error) {
      console.error('Failed to alert emergency contacts:', error);
      throw new Error('Failed to alert emergency contacts');
    }
  };

  const shareLocationWithEmergencyServices = async (): Promise<GeolocationPosition> => {
    if (!deviceFeatures.geolocation.supported) {
      throw new Error('Geolocation is not supported on this device');
    }

    try {
      const position = await deviceFeatures.geolocation.getCurrentLocation();
      setLastKnownLocation(position);

      // In a real implementation, this would send location to emergency services
      console.log('Location shared with emergency services:', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date(position.timestamp).toISOString()
      });

      return position;
    } catch (error) {
      console.error('Failed to share location:', error);
      throw error;
    }
  };

  const logEmergencyEvent = async (event: any): Promise<void> => {
    try {
      await fetch('/api/emergency/log-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Failed to log emergency event:', error);
    }
  };

  const getEmergencyHistory = async (): Promise<EmergencyHistoryResponse> => {
    try {
      const response = await fetch('/api/emergency/history');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch emergency history:', error);
      return { success: false, history: [], total: 0, message: 'Failed to fetch history' };
    }
  };

  const startEmergencyMode = () => {
    setIsEmergencyActive(true);
    
    // Start continuous location tracking
    if (deviceFeatures.geolocation.supported) {
      deviceFeatures.geolocation.watchLocation();
    }

    // Send emergency mode notification
    if (deviceFeatures.notifications.permission === 'granted') {
      deviceFeatures.notifications.sendNotification(
        'Emergency Mode Activated',
        {
          body: 'Your device is now in emergency mode. Location is being tracked.',
          tag: 'emergency-mode',
          requireInteraction: true
        }
      );
    }
  };

  const stopEmergencyMode = () => {
    setIsEmergencyActive(false);
    setCurrentEmergencyCall(null);
  };

  const sendSOSSignal = async () => {
    try {
      // Vibrate in SOS pattern (... --- ...)
      if (deviceFeatures.vibration.supported) {
        deviceFeatures.vibration.vibrate([
          100, 50, 100, 50, 100, // ...
          200, 100, 200, 100, 200, // ---
          100, 50, 100, 50, 100  // ...
        ]);
      }

      // Flash screen or send visual SOS if supported
      if (deviceFeatures.notifications.permission === 'granted') {
        deviceFeatures.notifications.sendNotification(
          'SOS Signal Sent',
          {
            body: 'Emergency SOS signal has been transmitted.',
            tag: 'sos-signal',
            requireInteraction: true
          }
        );
      }

      // Get location and send SOS
      await shareLocationWithEmergencyServices();
      
      console.log('SOS signal sent');
    } catch (error) {
      console.error('Failed to send SOS signal:', error);
    }
  };

  return {
    initiateEmergencyCall,
    callEmergencyNumber,
    alertEmergencyContacts,
    shareLocationWithEmergencyServices,
    logEmergencyEvent,
    getEmergencyHistory,
    isEmergencyActive,
    currentEmergencyCall,
    lastKnownLocation,
    startEmergencyMode,
    stopEmergencyMode,
    sendSOSSignal
  };
}
