import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmergencyButton } from "@/components/emergency/EmergencyButton";
import { Shield, Users, History, Phone, Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  className?: string;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  shortName?: string;
}

export function Header({ className = "" }: HeaderProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation: NavigationItem[] = [
    { name: "Home", href: "/", icon: Shield },
    {
      name: "Emergency Contacts",
      href: "/contacts",
      icon: Users,
      shortName: "Contacts",
    },
    {
      name: "Emergency History",
      href: "/history",
      icon: History,
      shortName: "History",
    },
    {
      name: "Emergency Call",
      href: "/emergency",
      icon: Phone,
      shortName: "Call",
    },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header
        className={`bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 min-w-0 flex-shrink-0"
              onClick={closeMobileMenu}
            >
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary hidden sm:block">
                EmergencyGuard
              </span>
              <span className="text-lg font-bold text-secondary sm:hidden">
                EG
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 min-h-[44px] ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden xl:block">{item.name}</span>
                    <span className="xl:hidden">
                      {item.shortName || item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Navigation Button & Emergency Button */}
            <div className="flex items-center space-x-2">
              {/* Emergency Button - Always Visible */}
              <EmergencyButton
                variant="inline"
                className="px-3 sm:px-4"
                size="sm"
              />

              {/* Mobile Menu Button */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden min-h-[44px] min-w-[44px] p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors min-h-[48px] ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default Header;
