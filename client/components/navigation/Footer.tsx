import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

interface FooterProps {
  className?: string;
}

interface FooterLink {
  name: string;
  href: string;
}

export function Footer({ className = "" }: FooterProps) {
  const legalLinks: FooterLink[] = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  const supportLinks: FooterLink[] = [
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/api/docs" },
  ];

  return (
    <footer className={`bg-secondary text-white mt-16 pb-16 sm:pb-0 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">EmergencyGuard</span>
            </div>
            <p className="text-slate-300 mb-4 max-w-md">
              Your trusted companion for emergency preparedness and rapid response. 
              Real emergency calling with GPS location sharing and emergency contact alerts.
            </p>
            <div className="text-sm text-slate-400">
              <p className="mb-2">
                <strong className="text-red-300">⚠️ Real Emergency System:</strong> This app makes actual emergency calls.
              </p>
              <p>For life-threatening emergencies, call 911 directly.</p>
            </div>
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
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
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
              {supportLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-slate-300 hover:text-white transition-colors block min-h-[44px] flex items-center"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-600 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-center md:text-left">
              <p>&copy; 2024 EmergencyGuard. All rights reserved.</p>
            </div>
            <div className="text-slate-400 text-center md:text-right text-sm">
              <p>Built with ❤️ for emergency preparedness and safety</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
