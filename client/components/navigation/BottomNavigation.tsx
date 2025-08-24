import { Link, useLocation } from "react-router-dom";
import { Shield, Users, History, Phone } from "lucide-react";

interface BottomNavigationProps {
  className?: string;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  shortName: string;
}

export function BottomNavigation({ className = "" }: BottomNavigationProps) {
  const location = useLocation();

  const navigation: NavigationItem[] = [
    { name: "Home", href: "/", icon: Shield, shortName: "Home" },
    { name: "Emergency Contacts", href: "/contacts", icon: Users, shortName: "Contacts" },
    { name: "Emergency History", href: "/history", icon: History, shortName: "History" },
    { name: "Emergency Call", href: "/emergency", icon: Phone, shortName: "Call" },
  ];

  return (
    <nav className={`sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 z-40 ${className}`}>
      <div className="flex justify-around py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 min-h-[56px] min-w-[64px] transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.shortName}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNavigation;
