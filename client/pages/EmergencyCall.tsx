import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  AlertTriangle, 
  MapPin, 
  Clock,
  Shield,
  Heart,
  Users
} from "lucide-react";

export default function EmergencyCall() {
  return (
    <Layout>
      <div className="py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Warning Banner */}
          <div className="bg-emergency/10 border border-emergency/20 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center text-center">
              <AlertTriangle className="h-6 w-6 text-emergency mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-emergency mb-1">Emergency Services</h2>
                <p className="text-emergency/80">This is a demonstration page. In a real emergency, call 911 immediately.</p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-emergency/10 text-emergency rounded-full text-sm font-medium mb-6">
              <Phone className="h-4 w-4 mr-2" />
              Emergency Response
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              Emergency Call Center
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Quick access to emergency services and immediate assistance when you need it most.
            </p>
          </div>

          {/* Emergency Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-emergency text-white rounded-xl p-8 text-center">
              <Phone className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Call 911</h3>
              <p className="mb-6 opacity-90">Connect directly to emergency services</p>
              <Button className="bg-white text-emergency hover:bg-slate-100 w-full">
                Emergency Call
              </Button>
            </div>

            <div className="bg-primary text-white rounded-xl p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Alert Contacts</h3>
              <p className="mb-6 opacity-90">Notify your emergency contacts immediately</p>
              <Button className="bg-white text-primary hover:bg-slate-100 w-full">
                Send Alerts
              </Button>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-slate-200 mb-8">
            <h2 className="text-2xl font-semibold text-secondary mb-6 text-center">Current Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-safe/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-safe" />
                </div>
                <h3 className="font-semibold text-secondary mb-2">Location Services</h3>
                <p className="text-safe text-sm">Active & Accurate</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-safe/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-safe" />
                </div>
                <h3 className="font-semibold text-secondary mb-2">Emergency Services</h3>
                <p className="text-safe text-sm">Available 24/7</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-safe/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-safe" />
                </div>
                <h3 className="font-semibold text-secondary mb-2">Emergency Contacts</h3>
                <p className="text-safe text-sm">4 Contacts Ready</p>
              </div>
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
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold text-secondary mb-6">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Clock className="h-4 w-4 mr-2" />
                View Emergency History
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
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
