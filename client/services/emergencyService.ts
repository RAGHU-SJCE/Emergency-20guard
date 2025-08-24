import { 
  EmergencyCallRequest, 
  EmergencyCallResponse, 
  ContactAlertRequest, 
  ContactAlertResponse,
  EmergencyHistoryResponse 
} from '@shared/api';

export interface EmergencyContact {
  name: string;
  phone?: string;
  email?: string;
  relationship: string;
}

export interface EmergencyLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

export interface EmergencyCallOptions {
  type: 'medical' | 'fire' | 'police' | 'general';
  location?: EmergencyLocation;
  userInfo?: {
    name?: string;
    phone?: string;
    medicalInfo?: string;
  };
}

export interface ContactAlertOptions {
  contacts: EmergencyContact[];
  message: string;
  emergencyType: string;
  location?: EmergencyLocation;
}

class EmergencyService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/emergency';
  }

  /**
   * Initiate an emergency call
   */
  async initiateEmergencyCall(options: EmergencyCallOptions): Promise<EmergencyCallResponse> {
    const requestData: EmergencyCallRequest = {
      emergencyType: options.type,
      timestamp: new Date().toISOString(),
      location: options.location ? {
        latitude: options.location.latitude,
        longitude: options.location.longitude,
        accuracy: options.location.accuracy
      } : undefined,
      userInfo: options.userInfo
    };

    const response = await fetch(`${this.baseUrl}/call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Emergency call failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Alert emergency contacts
   */
  async alertEmergencyContacts(options: ContactAlertOptions): Promise<ContactAlertResponse> {
    const requestData: ContactAlertRequest = {
      contacts: options.contacts,
      message: options.message,
      emergencyType: options.emergencyType,
      location: options.location ? {
        latitude: options.location.latitude,
        longitude: options.location.longitude
      } : undefined
    };

    const response = await fetch(`${this.baseUrl}/alert-contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Contact alert failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Log an emergency event
   */
  async logEmergencyEvent(eventData: any): Promise<void> {
    const response = await fetch(`${this.baseUrl}/log-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`Event logging failed: ${response.statusText}`);
    }
  }

  /**
   * Get emergency history
   */
  async getEmergencyHistory(): Promise<EmergencyHistoryResponse> {
    const response = await fetch(`${this.baseUrl}/history`);

    if (!response.ok) {
      throw new Error(`Failed to fetch emergency history: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Make a direct phone call using tel: protocol
   */
  makeDirectCall(phoneNumber: string): void {
    try {
      window.open(`tel:${phoneNumber}`, '_self');
    } catch (error) {
      console.error('Failed to initiate phone call:', error);
      alert(`Please call ${phoneNumber} manually.`);
    }
  }

  /**
   * Generate emergency message for contacts
   */
  generateEmergencyMessage(
    emergencyType: string, 
    location?: EmergencyLocation, 
    customMessage?: string
  ): string {
    const baseMessage = customMessage || `Emergency situation - ${emergencyType} emergency. Please check on me immediately.`;
    
    if (location) {
      const locationText = location.address 
        ? `Location: ${location.address}`
        : `Location: https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
      
      return `🚨 EMERGENCY ALERT 🚨\n\n${baseMessage}\n\n${locationText}\n\nThis is an automated emergency notification from EmergencyGuard.`;
    }
    
    return `🚨 EMERGENCY ALERT 🚨\n\n${baseMessage}\n\nThis is an automated emergency notification from EmergencyGuard.`;
  }

  /**
   * Get emergency numbers by country/region
   */
  getEmergencyNumbers(countryCode = 'US'): { [key: string]: string } {
    const emergencyNumbers: { [country: string]: { [service: string]: string } } = {
      US: {
        general: '911',
        poison: '1-800-222-1222',
        suicide: '988'
      },
      CA: {
        general: '911'
      },
      UK: {
        general: '999',
        alternative: '112'
      },
      AU: {
        general: '000'
      },
      EU: {
        general: '112'
      }
    };

    return emergencyNumbers[countryCode] || emergencyNumbers.US;
  }

  /**
   * Validate emergency contact information
   */
  validateEmergencyContact(contact: EmergencyContact): string[] {
    const errors: string[] = [];

    if (!contact.name || contact.name.trim().length === 0) {
      errors.push('Contact name is required');
    }

    if (!contact.phone && !contact.email) {
      errors.push('At least one contact method (phone or email) is required');
    }

    if (contact.phone && !this.isValidPhoneNumber(contact.phone)) {
      errors.push('Invalid phone number format');
    }

    if (contact.email && !this.isValidEmail(contact.email)) {
      errors.push('Invalid email format');
    }

    if (!contact.relationship || contact.relationship.trim().length === 0) {
      errors.push('Relationship is required');
    }

    return errors;
  }

  /**
   * Validate phone number format
   */
  private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Calculate response time in minutes and seconds
   */
  calculateResponseTime(startTime: Date, endTime: Date): string {
    const diffMs = endTime.getTime() - startTime.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Format location for display
   */
  formatLocation(location: EmergencyLocation): string {
    if (location.address) {
      return location.address;
    }
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  /**
   * Get Google Maps URL for location
   */
  getGoogleMapsUrl(location: EmergencyLocation): string {
    return `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
  }
}

// Export singleton instance
export const emergencyService = new EmergencyService();
export default emergencyService;
