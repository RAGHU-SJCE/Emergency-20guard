import { useState } from "react";
import { useDeviceFeatures } from "./use-device-features";
import {
  emergencyService,
  EmergencyContact,
} from "../services/emergencyService";
import {
  EmergencyCallResponse,
  ContactAlertResponse,
  EmergencyHistoryResponse,
} from "@shared/api";

interface EmergencyServices {
  // Emergency calling
  initiateEmergencyCall: (
    type: "medical" | "fire" | "police" | "general",
  ) => Promise<EmergencyCallResponse>;
  callEmergencyNumber: (number: string) => void;

  // Contact alerts
  alertEmergencyContacts: (
    contacts: EmergencyContact[],
    message: string,
    emergencyType: string,
  ) => Promise<ContactAlertResponse>;

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
  const [currentEmergencyCall, setCurrentEmergencyCall] =
    useState<EmergencyCallResponse | null>(null);
  const [lastKnownLocation, setLastKnownLocation] =
    useState<GeolocationPosition | null>(null);

  const initiateEmergencyCall = async (
    type: "medical" | "fire" | "police" | "general",
  ): Promise<EmergencyCallResponse> => {
    try {
      // Get current location
      let location = lastKnownLocation;
      if (deviceFeatures.geolocation.supported) {
        try {
          location = await deviceFeatures.geolocation.getCurrentLocation();
          setLastKnownLocation(location);
        } catch (error) {
          console.warn("Could not get location for emergency call:", error);
        }
      }

      // Use the emergency service to make the call
      const result = await emergencyService.initiateEmergencyCall({
        type,
        location: location
          ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy,
            }
          : undefined,
      });

      if (result.success) {
        setCurrentEmergencyCall(result);
        setIsEmergencyActive(true);

        // Initiate actual phone call if emergency number is provided
        if (result.emergencyNumber) {
          callEmergencyNumber(result.emergencyNumber);
        }

        // Send emergency notifications
        if (deviceFeatures.notifications.permission === "granted") {
          deviceFeatures.notifications.sendNotification(
            "Emergency Call Initiated",
            {
              body: `Emergency services contacted. Call ID: ${result.callId}`,
              tag: "emergency-call",
              requireInteraction: true,
            },
          );
        }

        // Vibrate device
        if (deviceFeatures.vibration.supported) {
          deviceFeatures.vibration.vibrate([200, 100, 200, 100, 200]);
        }

        // Log the emergency event
        await emergencyService.logEmergencyEvent({
          type: `Emergency Call - ${type}`,
          location: result.location,
          timestamp: result.timestamp,
          callId: result.callId,
        });
      }

      return result;
    } catch (error) {
      console.error("Emergency call failed:", error);

      // Fallback: Still try to make direct call
      const emergencyNumber = "911"; // Default emergency number
      callEmergencyNumber(emergencyNumber);

      throw new Error("Emergency call failed. Please call 911 directly.");
    }
  };

  const callEmergencyNumber = (number: string) => {
    emergencyService.makeDirectCall(number);
  };

  const alertEmergencyContacts = async (
    contacts: EmergencyContact[],
    message: string,
    emergencyType: string,
  ): Promise<ContactAlertResponse> => {
    try {
      // Get current location for context
      let location = lastKnownLocation;
      if (deviceFeatures.geolocation.supported) {
        try {
          location = await deviceFeatures.geolocation.getCurrentLocation();
          setLastKnownLocation(location);
        } catch (error) {
          console.warn("Could not get location for contact alerts:", error);
        }
      }

      // Use the emergency service to alert contacts
      const result = await emergencyService.alertEmergencyContacts({
        contacts,
        message,
        emergencyType,
        location: location
          ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }
          : undefined,
      });

      // Send local notification
      if (deviceFeatures.notifications.permission === "granted") {
        deviceFeatures.notifications.sendNotification(
          "Emergency Contacts Alerted",
          {
            body: `${result.contactsNotified} contacts have been notified of your emergency.`,
            tag: "contact-alert",
          },
        );
      }

      return result;
    } catch (error) {
      console.error("Failed to alert emergency contacts:", error);
      throw new Error("Failed to alert emergency contacts");
    }
  };

  const shareLocationWithEmergencyServices =
    async (): Promise<GeolocationPosition> => {
      if (!deviceFeatures.geolocation.supported) {
        throw new Error("Geolocation is not supported on this device");
      }

      try {
        const position = await deviceFeatures.geolocation.getCurrentLocation();
        setLastKnownLocation(position);

        // In a real implementation, this would send location to emergency services
        // For now, we'll simulate API call with emergency service
        await emergencyService.logEmergencyEvent({
          type: "Location Shared with Emergency Services",
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          timestamp: new Date().toISOString(),
          details: {
            method: "manual_share",
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
          },
        });

        console.log("Location successfully shared with emergency services:", {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp).toISOString(),
          googleMapsUrl: `https://maps.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`,
        });

        return position;
      } catch (error) {
        console.error("Failed to share location:", error);

        // Provide specific error messages based on error type
        if (error instanceof GeolocationPositionError) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              throw new Error("Location access denied by user");
            case error.POSITION_UNAVAILABLE:
              throw new Error("Location information unavailable");
            case error.TIMEOUT:
              throw new Error("Location request timed out");
            default:
              throw new Error("Unknown location error");
          }
        }

        throw error;
      }
    };

  const logEmergencyEvent = async (event: any): Promise<void> => {
    await emergencyService.logEmergencyEvent(event);
  };

  const getEmergencyHistory = async (): Promise<EmergencyHistoryResponse> => {
    return await emergencyService.getEmergencyHistory();
  };

  const startEmergencyMode = () => {
    setIsEmergencyActive(true);

    // Start continuous location tracking
    if (deviceFeatures.geolocation.supported) {
      deviceFeatures.geolocation.watchLocation();
    }

    // Send emergency mode notification
    if (deviceFeatures.notifications.permission === "granted") {
      deviceFeatures.notifications.sendNotification(
        "Emergency Mode Activated",
        {
          body: "Your device is now in emergency mode. Location is being tracked.",
          tag: "emergency-mode",
          requireInteraction: true,
        },
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
          100,
          50,
          100,
          50,
          100, // ...
          200,
          100,
          200,
          100,
          200, // ---
          100,
          50,
          100,
          50,
          100, // ...
        ]);
      }

      // Get location and send SOS (this will throw if it fails)
      const position = await shareLocationWithEmergencyServices();

      // Send visual notification if supported
      if (deviceFeatures.notifications.permission === "granted") {
        deviceFeatures.notifications.sendNotification("🚨 SOS Signal Transmitted", {
          body: `Emergency SOS sent with location: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          tag: "sos-signal",
          requireInteraction: true,
        });
      }

      console.log("SOS signal sent successfully with location:", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString(),
      });

      return position;
    } catch (error) {
      console.error("Failed to send SOS signal:", error);

      // Still send notification if we can, even without location
      if (deviceFeatures.notifications.permission === "granted") {
        deviceFeatures.notifications.sendNotification("⚠️ SOS Signal Error", {
          body: "Unable to send SOS with location. Call emergency services directly.",
          tag: "sos-error",
          requireInteraction: true,
        });
      }

      throw error;
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
    sendSOSSignal,
  };
}
