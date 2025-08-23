import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useDeviceFeatures } from "@/hooks/use-device-features";
import { 
  Phone, 
  AlertTriangle, 
  MapPin, 
  Clock,
  Shield,
  Heart,
  Users,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Navigation,
  Bell,
  Vibrate
} from "lucide-react";
import { useState, useEffect } from "react";

export default function EmergencyCall() {
  const deviceFeatures = useDeviceFeatures();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [locationDisplay, setLocationDisplay] = useState<string>("Getting location...");

  // Get location on component mount
  useEffect(() => {
    if (deviceFeatures.geolocation.supported) {
      deviceFeatures.geolocation.getCurrentLocation()
        .then((position) => {
          const { latitude, longitude } = position.coords;
          setLocationDisplay(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        })
        .catch((error) => {
          setLocationDisplay("Location unavailable");
        });
    } else {
      setLocationDisplay("Location not supported");
    }
  }, [deviceFeatures.geolocation]);

  const handleEmergencyCall = async () => {
    setIsEmergencyActive(true);
    
    // Vibrate device
    if (deviceFeatures.vibration.supported) {
      deviceFeatures.vibration.vibrate([200, 100, 200, 100, 200]);
    }

    // Request notification permission if needed
    if (deviceFeatures.notifications.supported && deviceFeatures.notifications.permission !== 'granted') {
      await deviceFeatures.notifications.requestPermission();
    }

    // Send notification
    if (deviceFeatures.notifications.permission === 'granted') {
      deviceFeatures.notifications.sendNotification(
        'Emergency Call Initiated',
        {
          body: 'Emergency services have been contacted. Help is on the way.',
          tag: 'emergency-call',
          requireInteraction: true,
        }
      );
    }

    // In a real app, this would actually call emergency services
    setTimeout(() => {
      setIsEmergencyActive(false);
    }, 5000);
  };

  const handleAlertContacts = async () => {
    // Vibrate device
    if (deviceFeatures.vibration.supported) {
      deviceFeatures.vibration.vibrate([100, 50, 100, 50, 100]);
    }

    // Send notification
    if (deviceFeatures.notifications.permission === 'granted') {
      deviceFeatures.notifications.sendNotification(
        'Emergency Contacts Alerted',
        {
          body: 'Your emergency contacts have been notified of your situation.',
          tag: 'contacts-alert',
        }
      );
    }
  };

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
        console.warn('Location permission denied or unavailable');
      }
    }
  };

  return (
    <Layout>
      <div className="py-8 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* System Status */}
          <div className="mb-8 bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-secondary mb-4 text-center">System Status</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Network Status */}
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  deviceFeatures.networkStatus.online ? 'bg-safe/10' : 'bg-emergency/10'
                }`}>
                  {deviceFeatures.networkStatus.online ? (
                    <Wifi className="h-6 w-6 text-safe" />
                  ) : (
                    <WifiOff className="h-6 w-6 text-emergency" />
                  )}
                </div>
                <p className="text-xs font-medium text-secondary">
                  {deviceFeatures.networkStatus.online ? 'Online' : 'Offline'}
                </p>
                {deviceFeatures.networkStatus.connectionType && (
                  <p className="text-xs text-slate-500">{deviceFeatures.networkStatus.connectionType}</p>
                )}
              </div>

              {/* Location Status */}
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  deviceFeatures.geolocation.permission === 'granted' ? 'bg-safe/10' : 'bg-warning/10'
                }`}>
                  <MapPin className={`h-6 w-6 ${
                    deviceFeatures.geolocation.permission === 'granted' ? 'text-safe' : 'text-warning'
                  }`} />
                </div>
                <p className="text-xs font-medium text-secondary">Location</p>
                <p className="text-xs text-slate-500">
                  {deviceFeatures.geolocation.permission === 'granted' ? 'Active' : 'Needs Permission'}
                </p>
              </div>

              {/* Notifications */}
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  deviceFeatures.notifications.permission === 'granted' ? 'bg-safe/10' : 'bg-warning/10'
                }`}>
                  <Bell className={`h-6 w-6 ${
                    deviceFeatures.notifications.permission === 'granted' ? 'text-safe' : 'text-warning'
                  }`} />
                </div>
                <p className="text-xs font-medium text-secondary">Notifications</p>
                <p className="text-xs text-slate-500">
                  {deviceFeatures.notifications.permission === 'granted' ? 'Enabled' : 'Needs Permission'}
                </p>
              </div>

              {/* Battery */}
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  (deviceFeatures.battery.level || 1) > 0.2 ? 'bg-safe/10' : 'bg-warning/10'
                }`}>
                  {(deviceFeatures.battery.level || 1) > 0.2 ? (
                    <Battery className="h-6 w-6 text-safe" />
                  ) : (
                    <BatteryLow className="h-6 w-6 text-warning" />
                  )}
                </div>
                <p className="text-xs font-medium text-secondary">Battery</p>
                <p className="text-xs text-slate-500">
                  {deviceFeatures.battery.level 
                    ? `${Math.round(deviceFeatures.battery.level * 100)}%`
                    : 'Unknown'
                  }
                </p>
              </div>
            </div>

            {/* Permissions Button */}
            {(deviceFeatures.geolocation.permission !== 'granted' || 
              deviceFeatures.notifications.permission !== 'granted') && (
              <div className="mt-4 text-center">
                <Button 
                  onClick={requestPermissions}
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Enable Permissions
                </Button>
              </div>
            )}
          </div>

          {/* Warning Banner */}
          <div className="bg-emergency/10 border border-emergency/20 rounded-xl p-4 lg:p-6 mb-8">
            <div className="flex items-center justify-center text-center">
              <AlertTriangle className="h-6 w-6 text-emergency mr-3 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-emergency mb-1">Emergency Services</h2>
                <p className="text-emergency/80 text-sm">This is a demonstration page. In a real emergency, call 911 immediately.</p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-emergency/10 text-emergency rounded-full text-sm font-medium mb-6">
              <Phone className="h-4 w-4 mr-2" />
              Emergency Response
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-secondary mb-4 lg:mb-6">
              Emergency Call Center
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
              Quick access to emergency services and immediate assistance when you need it most.
            </p>
          </div>

          {/* Current Location */}
          {deviceFeatures.geolocation.currentLocation && (
            <div className="mb-8 bg-gradient-to-r from-primary/5 to-safe/5 rounded-xl p-4 lg:p-6">
              <div className="flex items-center justify-center text-center">
                <Navigation className="h-5 w-5 text-primary mr-2" />
                <div>
                  <h3 className="font-semibold text-secondary">Current Location</h3>
                  <p className="text-sm text-slate-600">{locationDisplay}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Accuracy: ±{Math.round(deviceFeatures.geolocation.currentLocation.coords.accuracy)}m
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-12">
            <div className="bg-emergency text-white rounded-xl p-6 lg:p-8 text-center">
              <Phone className="h-10 lg:h-12 w-10 lg:w-12 mx-auto mb-4" />
              <h3 className="text-xl lg:text-2xl font-bold mb-4">Call 911</h3>
              <p className="mb-6 opacity-90">Connect directly to emergency services</p>
              <Button 
                className={`bg-white text-emergency hover:bg-slate-100 w-full min-h-[48px] ${
                  isEmergencyActive ? 'animate-pulse' : ''
                }`}
                onClick={handleEmergencyCall}
                disabled={isEmergencyActive}
              >
                {isEmergencyActive ? 'Connecting...' : 'Emergency Call'}
              </Button>
            </div>

            <div className="bg-primary text-white rounded-xl p-6 lg:p-8 text-center">
              <Users className="h-10 lg:h-12 w-10 lg:w-12 mx-auto mb-4" />
              <h3 className="text-xl lg:text-2xl font-bold mb-4">Alert Contacts</h3>
              <p className="mb-6 opacity-90">Notify your emergency contacts immediately</p>
              <Button 
                className="bg-white text-primary hover:bg-slate-100 w-full min-h-[48px]"
                onClick={handleAlertContacts}
              >
                Send Alerts
              </Button>
            </div>
          </div>

          {/* Device Features Test */}
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-slate-200 mb-8">
            <h2 className="text-lg font-semibold text-secondary mb-4 text-center">Device Features Test</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => deviceFeatures.vibration.vibrate([100, 100, 100])}
                disabled={!deviceFeatures.vibration.supported}
                className="min-h-[48px]"
              >
                <Vibrate className="h-4 w-4 mr-2" />
                Test Vibration
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => deviceFeatures.notifications.sendNotification('Test Notification', {
                  body: 'This is a test notification from EmergencyGuard'
                })}
                disabled={deviceFeatures.notifications.permission !== 'granted'}
                className="min-h-[48px]"
              >
                <Bell className="h-4 w-4 mr-2" />
                Test Notification
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => deviceFeatures.geolocation.getCurrentLocation()}
                disabled={!deviceFeatures.geolocation.supported}
                className="min-h-[48px] col-span-2 lg:col-span-1"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Update Location
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-secondary mb-6">Emergency Instructions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-warning mr-2" />
                  In Case of Emergency
                </h3>
                <ol className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-emergency text-white rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold">1</span>
                    Stay calm and assess the situation
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-emergency text-white rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold">2</span>
                    Use the emergency call button if immediate help is needed
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-emergency text-white rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold">3</span>
                    Your location will be shared automatically
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-emergency text-white rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold">4</span>
                    Emergency contacts will be notified automatically
                  </li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold text-secondary mb-4 flex items-center">
                  <Heart className="h-5 w-5 text-safe mr-2" />
                  Safety Tips
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Keep your phone charged and accessible
                  </li>
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Ensure location services are enabled
                  </li>
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Keep emergency contacts updated
                  </li>
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Practice using the app when not in emergency
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 lg:mt-12 text-center">
            <h2 className="text-2xl font-semibold text-secondary mb-6">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 min-h-[48px]">
                <Clock className="h-4 w-4 mr-2" />
                View Emergency History
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 min-h-[48px]">
                <Users className="h-4 w-4 mr-2" />
                Manage Emergency Contacts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
