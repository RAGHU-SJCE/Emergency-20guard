import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Phone, Users, History } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary">
                EmergencyGuard
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Emergency Button */}
            <Button className="bg-emergency hover:bg-emergency/90 text-white">
              <Phone className="h-4 w-4 mr-2" />
              Emergency
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-secondary text-white mt-16">
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
                Your trusted companion for emergency preparedness and rapid
                response.
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
                      className="text-slate-300 hover:text-white transition-colors"
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
              <p className="text-slate-300 mb-2">support@emergencyguard.com</p>
              <p className="text-slate-300">privacy@emergencyguard.com</p>
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
