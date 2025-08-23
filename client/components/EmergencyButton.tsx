import { Button } from "@/components/ui/button";
import { Phone, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeviceFeatures } from "@/hooks/use-device-features";
import { useState } from "react";

interface EmergencyButtonProps {
  variant?: "floating" | "inline" | "hero";
  className?: string;
  showAlert?: boolean;
}

export function EmergencyButton({ 
  variant = "inline", 
  className = "", 
  showAlert = false 
}: EmergencyButtonProps) {
  const deviceFeatures = useDeviceFeatures();
  const [isPressed, setIsPressed] = useState(false);

  const handleEmergencyPress = () => {
    setIsPressed(true);
    
    // Haptic feedback
    if (deviceFeatures.vibration.supported) {
      deviceFeatures.vibration.vibrate([200, 100, 200]);
    }

    // Reset pressed state
    setTimeout(() => setIsPressed(false), 200);
  };

  const baseClasses = "transition-all duration-200 font-bold active:scale-95";
  
  const variantClasses = {
    floating: `
      fixed bottom-6 right-6 z-50 rounded-full w-16 h-16 shadow-2xl
      bg-gradient-to-r from-emergency to-red-600 
      hover:from-emergency/90 hover:to-red-600/90
      border-4 border-white/20
      backdrop-blur-sm
      ${isPressed ? 'scale-110 shadow-3xl' : 'hover:scale-110'}
      emergency-pulse
    `,
    inline: `
      bg-gradient-to-r from-emergency to-red-600 
      hover:from-emergency/90 hover:to-red-600/90
      text-white border-2 border-emergency/20
      shadow-lg hover:shadow-xl
      ${isPressed ? 'scale-105' : 'hover:scale-105'}
      emergency-pulse
    `,
    hero: `
      bg-gradient-to-r from-emergency to-red-600 
      hover:from-emergency/90 hover:to-red-600/90
      text-white border-2 border-emergency/20
      shadow-xl hover:shadow-2xl
      text-lg font-bold py-4 px-8 rounded-xl
      ${isPressed ? 'scale-105' : 'hover:scale-105'}
      emergency-pulse
      min-h-[64px]
    `
  };

  if (variant === "floating") {
    return (
      <Link to="/emergency">
        <Button
          className={`${baseClasses} ${variantClasses.floating} ${className}`}
          onClick={handleEmergencyPress}
          size="icon-xl"
          aria-label="Emergency Call"
        >
          <Phone className="h-8 w-8 text-white" />
        </Button>
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <Link to="/emergency">
        <Button
          className={`${baseClasses} ${variantClasses.hero} ${className}`}
          onClick={handleEmergencyPress}
          size="xl"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Phone className="h-6 w-6" />
              {showAlert && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
              )}
            </div>
            <span>Emergency Call Now</span>
            <Zap className="h-5 w-5" />
          </div>
        </Button>
      </Link>
    );
  }

  return (
    <Link to="/emergency">
      <Button
        className={`${baseClasses} ${variantClasses.inline} ${className}`}
        onClick={handleEmergencyPress}
        size="lg"
      >
        <Phone className="h-5 w-5 mr-2" />
        Emergency
      </Button>
    </Link>
  );
}

// Quick Emergency Actions Component
export function QuickEmergencyActions() {
  const deviceFeatures = useDeviceFeatures();

  const handleQuickAction = async (action: string) => {
    // Vibrate for feedback
    if (deviceFeatures.vibration.supported) {
      deviceFeatures.vibration.vibrate([100, 50, 100]);
    }

    // Send notification
    if (deviceFeatures.notifications.permission === 'granted') {
      deviceFeatures.notifications.sendNotification(
        `Quick Action: ${action}`,
        {
          body: `${action} action triggered`,
          tag: 'quick-action',
        }
      );
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-40 sm:hidden">
      <div className="flex flex-col space-y-3">
        {/* Quick Contacts Alert */}
        <Button
          size="icon-lg"
          className="rounded-full bg-primary/90 hover:bg-primary text-white shadow-lg"
          onClick={() => handleQuickAction('Contact Alert')}
          aria-label="Alert Emergency Contacts"
        >
          <Phone className="h-5 w-5" />
        </Button>

        {/* Location Share */}
        <Button
          size="icon-lg"
          className="rounded-full bg-secondary/90 hover:bg-secondary text-white shadow-lg"
          onClick={() => handleQuickAction('Location Share')}
          aria-label="Share Location"
        >
          <Zap className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
