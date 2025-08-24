/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Emergency API Types
export interface EmergencyCallRequest {
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  userInfo?: {
    name?: string;
    phone?: string;
    medicalInfo?: string;
  };
  emergencyType: 'medical' | 'fire' | 'police' | 'general';
  timestamp: string;
}

export interface EmergencyCallResponse {
  success: boolean;
  callId: string;
  message: string;
  emergencyNumber?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: string;
}

export interface ContactAlertRequest {
  contacts: Array<{
    name: string;
    phone?: string;
    email?: string;
    relationship: string;
  }>;
  message: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  emergencyType: string;
}

export interface ContactAlertResponse {
  success: boolean;
  alertId: string;
  contactsNotified: number;
  failedContacts: string[];
  message: string;
}

export interface EmergencyEvent {
  id: string;
  type: string;
  date: string;
  time: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: string;
  responseTime: string;
  contacts: string[];
  notes: string;
  emergencyNumber?: string;
  callId?: string;
}

export interface EmergencyHistoryResponse {
  success: boolean;
  history: EmergencyEvent[];
  total: number;
  message?: string;
}
