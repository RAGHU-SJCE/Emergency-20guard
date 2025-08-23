import { useState, useEffect } from "react";

interface DeviceFeatures {
  geolocation: {
    supported: boolean;
    permission: PermissionState | null;
    currentLocation: GeolocationPosition | null;
    error: string | null;
    isLoading: boolean;
    getCurrentLocation: () => Promise<GeolocationPosition>;
    watchLocation: () => number | null;
    clearWatch: (watchId: number) => void;
  };
  notifications: {
    supported: boolean;
    permission: NotificationPermission;
    requestPermission: () => Promise<NotificationPermission>;
    sendNotification: (title: string, options?: NotificationOptions) => void;
  };
  vibration: {
    supported: boolean;
    vibrate: (pattern: number | number[]) => boolean;
  };
  battery: {
    supported: boolean;
    level: number | null;
    charging: boolean | null;
  };
  networkStatus: {
    online: boolean;
    connectionType: string | null;
  };
}

export function useDeviceFeatures(): DeviceFeatures {
  const [geolocationPermission, setGeolocationPermission] =
    useState<PermissionState | null>(null);
  const [currentLocation, setCurrentLocation] =
    useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState<boolean | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  // Check geolocation permission on mount
  useEffect(() => {
    if ("geolocation" in navigator && "permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setGeolocationPermission(result.state);
        result.addEventListener("change", () => {
          setGeolocationPermission(result.state);
        });
      });
    }
  }, []);

  // Check notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check connection type if available
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection?.effectiveType || null);

      connection?.addEventListener("change", () => {
        setConnectionType(connection.effectiveType || null);
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Monitor battery status
  useEffect(() => {
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(battery.level);
        setBatteryCharging(battery.charging);

        battery.addEventListener("levelchange", () => {
          setBatteryLevel(battery.level);
        });

        battery.addEventListener("chargingchange", () => {
          setBatteryCharging(battery.charging);
        });
      });
    }
  }, []);

  const getCurrentLocation = async (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      setIsLoadingLocation(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position);
          setIsLoadingLocation(false);
          resolve(position);
        },
        (error) => {
          const errorMessage = `Location error: ${error.message}`;
          setLocationError(errorMessage);
          setIsLoadingLocation(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // 1 minute
        },
      );
    });
  };

  const watchLocation = (): number | null => {
    if (!("geolocation" in navigator)) {
      return null;
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation(position);
        setLocationError(null);
      },
      (error) => {
        setLocationError(`Location error: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const clearWatch = (watchId: number) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.clearWatch(watchId);
    }
  };

  const requestNotificationPermission =
    async (): Promise<NotificationPermission> => {
      if (!("Notification" in window)) {
        return "denied";
      }

      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission;
    };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      console.warn("Notifications not available or permission denied");
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [200, 100, 200],
      requireInteraction: true,
      tag: "emergency-notification",
      ...options,
    };

    new Notification(title, defaultOptions);
  };

  const vibrate = (pattern: number | number[]): boolean => {
    if (!("vibrate" in navigator)) {
      return false;
    }

    return navigator.vibrate(pattern);
  };

  return {
    geolocation: {
      supported: "geolocation" in navigator,
      permission: geolocationPermission,
      currentLocation,
      error: locationError,
      isLoading: isLoadingLocation,
      getCurrentLocation,
      watchLocation,
      clearWatch,
    },
    notifications: {
      supported: "Notification" in window,
      permission: notificationPermission,
      requestPermission: requestNotificationPermission,
      sendNotification,
    },
    vibration: {
      supported: "vibrate" in navigator,
      vibrate,
    },
    battery: {
      supported: "getBattery" in navigator,
      level: batteryLevel,
      charging: batteryCharging,
    },
    networkStatus: {
      online: isOnline,
      connectionType,
    },
  };
}
