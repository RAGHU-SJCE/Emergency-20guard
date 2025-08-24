import { Button } from "@/components/ui/button";
import { Phone, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeviceFeatures } from "@/hooks/use-device-features";
import { useState } from "react";

interface EmergencyButtonProps {
  variant?: "floating" | "inline" | "hero";
  className?: string;
  showAlert?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  onClick?: () => void;
}

export function EmergencyButton({
  variant = "inline",
  className = "",
  showAlert = false,
  size = "md",
  disabled = false,
  onClick,
}: EmergencyButtonProps) {
  const deviceFeatures = useDeviceFeatures();
  const [isPressed, setIsPressed] = useState(false);

  const handleEmergencyPress = () => {
    setIsPressed(true);

    // Haptic feedback
    if (deviceFeatures.vibration.supported) {
      deviceFeatures.vibration.vibrate([200, 100, 200]);
    }

    // Custom onClick handler
    if (onClick) {
      onClick();
    }

    // Reset pressed state
    setTimeout(() => setIsPressed(false), 200);
  };

  const baseClasses = "transition-all duration-200 font-bold active:scale-95";

  const sizeClasses = {
    sm: "text-sm px-3 py-2 min-h-[40px]",
    md: "text-base px-4 py-2 min-h-[44px]",
    lg: "text-lg px-6 py-3 min-h-[48px]",
    xl: "text-xl px-8 py-4 min-h-[56px]",
  };

  const variantClasses = {
    floating: `
      fixed bottom-6 right-6 z-50 rounded-full w-16 h-16 shadow-2xl
      bg-gradient-to-r from-emergency to-red-600 
      hover:from-emergency/90 hover:to-red-600/90
      border-4 border-white/20
      backdrop-blur-sm
      ${isPressed ? "scale-110 shadow-3xl" : "hover:scale-110"}
      emergency-pulse
    `,
    inline: `
      bg-gradient-to-r from-emergency to-red-600 
      hover:from-emergency/90 hover:to-red-600/90
      text-white border-2 border-emergency/20
      shadow-lg hover:shadow-xl
      ${isPressed ? "scale-105" : "hover:scale-105"}
      emergency-pulse
      ${sizeClasses[size]}
    `,
    hero: `
      bg-gradient-to-r from-emergency to-red-600 
      hover:from-emergency/90 hover:to-red-600/90
      text-white border-2 border-emergency/20
      shadow-xl hover:shadow-2xl
      font-bold py-4 px-8 rounded-xl
      ${isPressed ? "scale-105" : "hover:scale-105"}
      emergency-pulse
      min-h-[64px]
    `,
  };

  if (variant === "floating") {
    return (
      <Link to="/emergency">
        <Button
          className={`${baseClasses} ${variantClasses.floating} ${className}`}
          onClick={handleEmergencyPress}
          size="icon-xl"
          disabled={disabled}
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
          disabled={disabled}
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
        disabled={disabled}
      >
        <Phone className="h-5 w-5 mr-2" />
        Emergency
      </Button>
    </Link>
  );
}

export default EmergencyButton;
