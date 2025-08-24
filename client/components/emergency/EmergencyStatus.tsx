import { useDeviceFeatures } from "@/hooks/use-device-features";
import { useEmergencyServices } from "@/hooks/use-emergency-services";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  WifiOff,
  MapPin,
  Bell,
  Battery,
  BatteryLow,
  Shield,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface EmergencyStatusProps {
  showPermissionButton?: boolean;
  compact?: boolean;
  className?: string;
}

export function EmergencyStatus({
  showPermissionButton = true,
  compact = false,
  className = "",
}: EmergencyStatusProps) {
  const deviceFeatures = useDeviceFeatures();
  const emergencyServices = useEmergencyServices();

  const requestPermissions = async () => {
    // Request notification permission
    if (deviceFeatures.notifications.supported) {
      await deviceFeatures.notifications.requestPermission();
    }

    // Request location permission by trying to get location
    if (deviceFeatures.geolocation.supported) {
      try {
        await deviceFeatures.geolocation.getCurrentLocation();
      } catch (error) {
        console.warn("Location permission denied or unavailable");
      }
    }
  };

  const statusItems = [
    {
      id: "network",
      label: "Network",
      value: deviceFeatures.networkStatus.online ? "Online" : "Offline",
      detail: deviceFeatures.networkStatus.connectionType,
      icon: deviceFeatures.networkStatus.online ? Wifi : WifiOff,
      status: deviceFeatures.networkStatus.online ? "safe" : "emergency",
    },
    {
      id: "location",
      label: "Location",
      value:
        deviceFeatures.geolocation.permission === "granted"
          ? "Active"
          : "Needs Permission",
      detail: null,
      icon: MapPin,
      status:
        deviceFeatures.geolocation.permission === "granted"
          ? "safe"
          : "warning",
    },
    {
      id: "notifications",
      label: "Notifications",
      value:
        deviceFeatures.notifications.permission === "granted"
          ? "Enabled"
          : "Needs Permission",
      detail: null,
      icon: Bell,
      status:
        deviceFeatures.notifications.permission === "granted"
          ? "safe"
          : "warning",
    },
    {
      id: "emergency",
      label: "Emergency Status",
      value: emergencyServices.isEmergencyActive ? "ACTIVE" : "Standby",
      detail: null,
      icon: emergencyServices.isEmergencyActive ? AlertTriangle : CheckCircle,
      status: emergencyServices.isEmergencyActive ? "emergency" : "safe",
    },
  ];

  // Add battery status if available
  if (deviceFeatures.battery.level !== null) {
    statusItems.splice(3, 0, {
      id: "battery",
      label: "Battery",
      value: `${Math.round(deviceFeatures.battery.level * 100)}%`,
      detail: deviceFeatures.battery.charging ? "Charging" : null,
      icon: deviceFeatures.battery.level > 0.2 ? Battery : BatteryLow,
      status: deviceFeatures.battery.level > 0.2 ? "safe" : "warning",
    });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-safe/10 text-safe";
      case "warning":
        return "bg-warning/10 text-warning";
      case "emergency":
        return "bg-emergency/10 text-emergency";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return "border-safe/20";
      case "warning":
        return "border-warning/20";
      case "emergency":
        return "border-emergency/20 animate-pulse";
      default:
        return "border-slate-200";
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {statusItems.slice(0, 3).map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(item.status)}`}
            >
              <Icon className="h-4 w-4" />
            </div>
          );
        })}
        {showPermissionButton &&
          (deviceFeatures.geolocation.permission !== "granted" ||
            deviceFeatures.notifications.permission !== "granted") && (
            <Button
              size="sm"
              variant="outline"
              onClick={requestPermissions}
              className="ml-2"
            >
              Enable
            </Button>
          )}
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 ${className}`}
    >
      <h2 className="text-lg font-semibold text-secondary mb-4 text-center">
        System Status
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statusItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 border-2 ${getStatusColor(item.status)} ${getStatusIcon(item.status)}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-medium text-secondary">{item.label}</p>
              <p className="text-xs text-slate-500">{item.value}</p>
              {item.detail && (
                <p className="text-xs text-slate-400">{item.detail}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Permissions Button */}
      {showPermissionButton &&
        (deviceFeatures.geolocation.permission !== "granted" ||
          deviceFeatures.notifications.permission !== "granted") && (
          <div className="mt-6 text-center">
            <Button
              onClick={requestPermissions}
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Shield className="h-4 w-4 mr-2" />
              Enable All Permissions
            </Button>
          </div>
        )}

      {/* Emergency Active Alert */}
      {emergencyServices.isEmergencyActive && (
        <div className="mt-4 p-3 bg-emergency/10 border border-emergency/20 rounded-lg">
          <div className="flex items-center justify-center text-center">
            <AlertTriangle className="h-5 w-5 text-emergency mr-2 animate-pulse" />
            <span className="text-emergency font-medium text-sm">
              Emergency Mode Active
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmergencyStatus;
