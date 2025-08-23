import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmergencyButton, QuickEmergencyActions } from "@/components/EmergencyButton";
import { Shield, Phone, Users, History, Menu, X } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Shield },
    { name: "Emergency Contacts", href: "/contacts", icon: Users },
    { name: "Emergency History", href: "/history", icon: History },
    { name: "Emergency Call", href: "/emergency", icon: Phone },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
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
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Navigation Button & Emergency Button */}
            <div className="flex items-center space-x-2">
              {/* Emergency Button - Always Visible */}
              <Link to="/emergency">
                <Button 
                  className="bg-emergency hover:bg-emergency/90 text-white min-h-[44px] px-3 sm:px-4"
                  size="sm"
                >
                  <Phone className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:block">Emergency</span>
                </Button>
              </Link>

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

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Floating Emergency Button for Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden z-50">
        <Link to="/emergency">
          <Button 
            className="bg-emergency hover:bg-emergency/90 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
            size="sm"
            onClick={closeMobileMenu}
          >
            <Phone className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 z-40">
        <div className="flex justify-around py-2">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMobileMenu}
                className={`flex flex-col items-center justify-center py-2 px-3 min-h-[56px] min-w-[64px] transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{
                  item.name === "Emergency Contacts" ? "Contacts" :
                  item.name === "Emergency History" ? "History" :
                  item.name === "Emergency Call" ? "Call" :
                  item.name
                }</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <footer className="bg-secondary text-white mt-16 pb-16 sm:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">EmergencyGuard</span>
              </div>
              <p className="text-slate-300">
                Your trusted companion for emergency preparedness and rapid response.
              </p>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-slate-300 hover:text-white transition-colors min-h-[44px] flex items-center"
                      onClick={closeMobileMenu}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <a 
                  href="mailto:support@emergencyguard.com"
                  className="text-slate-300 hover:text-white transition-colors block min-h-[44px] flex items-center"
                >
                  support@emergencyguard.com
                </a>
                <a 
                  href="mailto:privacy@emergencyguard.com"
                  className="text-slate-300 hover:text-white transition-colors block min-h-[44px] flex items-center"
                >
                  privacy@emergencyguard.com
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-600 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 EmergencyGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
