import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useDeviceFeatures } from "@/hooks/use-device-features";
import { useEmergencyServices } from "@/hooks/use-emergency-services";
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
  Vibrate,
  Zap,
  CheckCircle
} from "lucide-react";
import { useState, useEffect } from "react";

export default function EmergencyCall() {
  const deviceFeatures = useDeviceFeatures();
  const emergencyServices = useEmergencyServices();
  const [locationDisplay, setLocationDisplay] = useState<string>("Getting location...");
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<'medical' | 'fire' | 'police' | 'general'>('general');
  const [isCallInProgress, setIsCallInProgress] = useState(false);

  // Mock emergency contacts for alert functionality
  const emergencyContacts = [
    { name: "John Doe", phone: "+1-555-0123", email: "john@example.com", relationship: "Spouse" },
    { name: "Jane Smith", phone: "+1-555-0456", email: "jane@example.com", relationship: "Sister" },
    { name: "Dr. Wilson", phone: "+1-555-0789", email: "dr.wilson@hospital.com", relationship: "Doctor" }
  ];

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

  const handleRealEmergencyCall = async (type: 'medical' | 'fire' | 'police' | 'general') => {
    try {
      setIsCallInProgress(true);
      setSelectedEmergencyType(type);

      // Initiate real emergency call
      const response = await emergencyServices.initiateEmergencyCall(type);
      
      if (response.success) {
        // Show success state
        console.log('Emergency call initiated:', response);
        
        // Optional: Alert emergency contacts as well
        if (emergencyContacts.length > 0) {
          await emergencyServices.alertEmergencyContacts(
            emergencyContacts,
            `Emergency situation - ${type} emergency. Please check on me immediately.`,
            type
          );
        }
      }
    } catch (error) {
      console.error('Emergency call failed:', error);
      alert('Emergency call failed. Please call 911 directly.');
    } finally {
      // Keep call in progress state for a while to show the emergency is active
      setTimeout(() => setIsCallInProgress(false), 10000);
    }
  };

  const handleDirectCall = (number: string) => {
    emergencyServices.callEmergencyNumber(number);
  };

  const handleAlertContacts = async () => {
    try {
      const response = await emergencyServices.alertEmergencyContacts(
        emergencyContacts,
        "Emergency alert triggered. This is not a drill. Please check on me immediately.",
        selectedEmergencyType
      );
      
      if (response.success) {
        alert(`Successfully alerted ${response.contactsNotified} emergency contacts.`);
      }
    } catch (error) {
      console.error('Failed to alert contacts:', error);
      alert('Failed to alert emergency contacts. Please contact them manually.');
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

  const emergencyTypes = [
    { type: 'medical' as const, label: 'Medical Emergency', icon: Heart, color: 'bg-emergency', description: 'Medical emergency, injury, or health crisis' },
    { type: 'fire' as const, label: 'Fire Emergency', icon: AlertTriangle, color: 'bg-red-600', description: 'Fire, smoke, or dangerous gas emergency' },
    { type: 'police' as const, label: 'Police Emergency', icon: Shield, color: 'bg-blue-600', description: 'Crime, violence, or immediate danger' },
    { type: 'general' as const, label: 'General Emergency', icon: Phone, color: 'bg-orange-600', description: 'Other emergency situations' }
  ];

  return (
    <Layout>
      <div className="py-8 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* LEGAL DISCLAIMER */}
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 lg:p-6">
            <div className="flex">
              <AlertTriangle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-red-800 mb-2">IMPORTANT LEGAL DISCLAIMER</h2>
                <div className="text-red-700 text-sm space-y-2">
                  <p><strong>THIS IS A REAL EMERGENCY CALLING SYSTEM.</strong> Using these buttons will attempt to contact actual emergency services.</p>
                  <p>• This app is a supplementary tool and should not replace calling 911 directly</p>
                  <p>• In life-threatening situations, call 911 immediately using your phone's dialer</p>
                  <p>• The app creators are not responsible for failed emergency calls or response delays</p>
                  <p>• Location sharing and emergency contact alerts are provided as additional safety features</p>
                </div>
              </div>
            </div>
          </div>

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

              {/* Emergency Status */}
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  emergencyServices.isEmergencyActive ? 'bg-emergency/10' : 'bg-safe/10'
                }`}>
                  {emergencyServices.isEmergencyActive ? (
                    <AlertTriangle className="h-6 w-6 text-emergency animate-pulse" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-safe" />
                  )}
                </div>
                <p className="text-xs font-medium text-secondary">Emergency Status</p>
                <p className="text-xs text-slate-500">
                  {emergencyServices.isEmergencyActive ? 'ACTIVE' : 'Standby'}
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
                  Enable All Permissions
                </Button>
              </div>
            )}
          </div>

          {/* Current Location */}
          {emergencyServices.lastKnownLocation && (
            <div className="mb-8 bg-gradient-to-r from-primary/5 to-safe/5 rounded-xl p-4 lg:p-6">
              <div className="flex items-center justify-center text-center">
                <Navigation className="h-5 w-5 text-primary mr-2" />
                <div>
                  <h3 className="font-semibold text-secondary">Current Location</h3>
                  <p className="text-sm text-slate-600">{locationDisplay}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Accuracy: ±{Math.round(emergencyServices.lastKnownLocation.coords.accuracy)}m
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Type Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-6 text-center">Select Emergency Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyTypes.map((emergency) => {
                const Icon = emergency.icon;
                return (
                  <button
                    key={emergency.type}
                    onClick={() => setSelectedEmergencyType(emergency.type)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedEmergencyType === emergency.type
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${emergency.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary mb-1">{emergency.label}</h3>
                        <p className="text-sm text-slate-600">{emergency.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Emergency Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8">
            {/* Emergency Call Button */}
            <div className="bg-emergency text-white rounded-xl p-6 lg:p-8 text-center">
              <Phone className="h-10 lg:h-12 w-10 lg:w-12 mx-auto mb-4" />
              <h3 className="text-xl lg:text-2xl font-bold mb-4">Call Emergency Services</h3>
              <p className="mb-6 opacity-90">Immediately connect to emergency responders</p>
              <Button 
                className={`bg-white text-emergency hover:bg-slate-100 w-full min-h-[48px] font-bold ${
                  isCallInProgress ? 'animate-pulse' : ''
                }`}
                onClick={() => handleRealEmergencyCall(selectedEmergencyType)}
                disabled={isCallInProgress}
              >
                {isCallInProgress ? (
                  <>
                    <Phone className="h-5 w-5 mr-2 animate-pulse" />
                    Calling 911...
                  </>
                ) : (
                  <>
                    <Phone className="h-5 w-5 mr-2" />
                    Call 911 NOW
                  </>
                )}
              </Button>
            </div>

            {/* Alert Contacts */}
            <div className="bg-primary text-white rounded-xl p-6 lg:p-8 text-center">
              <Users className="h-10 lg:h-12 w-10 lg:w-12 mx-auto mb-4" />
              <h3 className="text-xl lg:text-2xl font-bold mb-4">Alert Emergency Contacts</h3>
              <p className="mb-6 opacity-90">Notify your emergency contacts with location</p>
              <Button 
                className="bg-white text-primary hover:bg-slate-100 w-full min-h-[48px] font-bold"
                onClick={handleAlertContacts}
              >
                <Users className="h-5 w-5 mr-2" />
                Alert Contacts ({emergencyContacts.length})
              </Button>
            </div>
          </div>

          {/* Quick Direct Call Options */}
          <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-secondary mb-4 text-center">Quick Direct Call</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDirectCall('911')}
                className="min-h-[48px] border-emergency text-emergency hover:bg-emergency/10"
              >
                <Phone className="h-4 w-4 mr-2" />
                911
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDirectCall('112')}
                className="min-h-[48px] border-emergency text-emergency hover:bg-emergency/10"
              >
                <Phone className="h-4 w-4 mr-2" />
                112 (International)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => emergencyServices.sendSOSSignal()}
                className="min-h-[48px] border-warning text-warning hover:bg-warning/10"
              >
                <Zap className="h-4 w-4 mr-2" />
                Send SOS
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => emergencyServices.shareLocationWithEmergencyServices()}
                className="min-h-[48px] border-safe text-safe hover:bg-safe/10"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Share Location
              </Button>
            </div>
          </div>

          {/* Emergency Status Display */}
          {emergencyServices.isEmergencyActive && emergencyServices.currentEmergencyCall && (
            <div className="mb-8 bg-emergency/10 border border-emergency/20 rounded-xl p-6">
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-emergency text-white rounded-full text-sm font-medium mb-4">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  EMERGENCY ACTIVE
                </div>
                <h2 className="text-xl font-semibold text-emergency mb-2">Emergency Call in Progress</h2>
                <p className="text-sm text-emergency/80 mb-4">Call ID: {emergencyServices.currentEmergencyCall.callId}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Emergency Number:</strong> {emergencyServices.currentEmergencyCall.emergencyNumber}
                  </div>
                  <div>
                    <strong>Time:</strong> {new Date(emergencyServices.currentEmergencyCall.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Safety Instructions */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-secondary mb-6">Emergency Instructions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-emergency mr-2" />
                  During an Emergency
                </h3>
                <ol className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-emergency text-white rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold">1</span>
                    Stay calm and assess the immediate danger
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-emergency text-white rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold">2</span>
                    Select the appropriate emergency type above
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-emergency text-white rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold">3</span>
                    Press "Call 911 NOW" for immediate assistance
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-emergency text-white rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold">4</span>
                    Your location will be automatically shared
                  </li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold text-secondary mb-4 flex items-center">
                  <Heart className="h-5 w-5 text-safe mr-2" />
                  Safety Reminders
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    This app supplements but does not replace calling 911 directly
                  </li>
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Keep your phone charged and ensure network connectivity
                  </li>
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Update your emergency contacts regularly
                  </li>
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Test the app features when NOT in an emergency
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
