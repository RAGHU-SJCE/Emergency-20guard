import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { EmergencyButton } from "@/components/emergency/EmergencyButton";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showBottomNav?: boolean;
  showFloatingButton?: boolean;
}

export function Layout({ 
  children, 
  className = "",
  showBottomNav = true,
  showFloatingButton = true
}: LayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 ${className}`}>
      {/* Header Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Floating Emergency Button for Mobile */}
      {showFloatingButton && (
        <div className="sm:hidden">
          <EmergencyButton variant="floating" />
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      {showBottomNav && <BottomNavigation />}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;
