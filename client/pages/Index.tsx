import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { EmergencyButton } from "@/components/EmergencyButton";
import { Link } from "react-router-dom";
import {
  Shield,
  Phone,
  Users,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Zap,
  Heart,
} from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: Phone,
      title: "Instant Emergency Calls",
      description:
        "Connect to emergency services with one tap, even when you can't speak.",
    },
    {
      icon: Users,
      title: "Emergency Contacts",
      description:
        "Automatically notify your trusted contacts when an emergency occurs.",
    },
    {
      icon: MapPin,
      title: "Location Sharing",
      description:
        "Share your real-time location with emergency responders and contacts.",
    },
    {
      icon: Clock,
      title: "Emergency History",
      description:
        "Keep track of all emergency events with detailed logs and reports.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is encrypted and only used when you need emergency help.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Optimized for speed when every second counts in an emergency.",
    },
  ];

  const stats = [
    { number: "99.9%", label: "Uptime Reliability" },
    { number: "<3s", label: "Average Response Time" },
    { number: "24/7", label: "Emergency Support" },
    { number: "100%", label: "Secure & Encrypted" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Legal Disclaimer Banner */}
            <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-center text-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <strong>REAL EMERGENCY SYSTEM:</strong> This app makes actual
                  emergency calls.
                  <span className="hidden sm:inline">
                    {" "}
                    For life-threatening emergencies, call 911 directly.
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-emergency/10 text-emergency rounded-full text-sm font-medium mb-6">
                <Shield className="h-4 w-4 mr-2" />
                Live Emergency Protection System
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary mb-6">
              Real Emergency Response
              <span className="text-primary block">When Seconds Count</span>
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
              EmergencyGuard connects you to real emergency services with GPS
              location sharing, automatic contact alerts, and comprehensive
              emergency logging.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <EmergencyButton variant="hero" showAlert />
              <Link to="/contacts">
                <Button variant="outline" size="xl" className="min-h-[64px]">
                  <Users className="h-5 w-5 mr-2" />
                  Manage Contacts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
              Comprehensive Emergency Protection
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to stay safe and connected during emergencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Actions Section */}
      <section className="py-20 bg-gradient-to-r from-emergency/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
              Ready for Any Emergency
            </h2>
            <p className="text-xl text-slate-600">
              Quick access to essential emergency features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/emergency" className="group">
              <div className="bg-emergency text-white rounded-xl p-6 text-center hover:bg-emergency/90 transition-colors">
                <Phone className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Emergency Call</h3>
                <p className="text-sm opacity-90">
                  Instant connection to emergency services
                </p>
              </div>
            </Link>

            <Link to="/contacts" className="group">
              <div className="bg-primary text-white rounded-xl p-6 text-center hover:bg-primary/90 transition-colors">
                <Users className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Emergency Contacts</h3>
                <p className="text-sm opacity-90">
                  Manage your emergency contact list
                </p>
              </div>
            </Link>

            <Link to="/history" className="group">
              <div className="bg-secondary text-white rounded-xl p-6 text-center hover:bg-secondary/90 transition-colors">
                <Clock className="h-8 w-8 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Emergency History</h3>
                <p className="text-sm opacity-90">View past emergency events</p>
              </div>
            </Link>

            <div className="bg-safe text-white rounded-xl p-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">System Status</h3>
              <p className="text-sm opacity-90">All systems operational</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Tips Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-slate-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mr-4">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-secondary">
                Emergency Preparedness Tips
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-secondary mb-4">
                  Before an Emergency
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Keep your emergency contacts up to date in the app
                  </li>
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Ensure location services are enabled for accurate
                    positioning
                  </li>
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Test the app regularly to ensure it works when needed
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-secondary mb-4">
                  During an Emergency
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Stay calm and use the emergency call feature immediately
                  </li>
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Your contacts will be automatically notified of your
                    situation
                  </li>
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Follow instructions from emergency responders
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Disclaimer Section */}
      <section className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 lg:p-12 shadow-sm border border-slate-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-4">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Important Legal Information
              </div>
              <h2 className="text-3xl font-bold text-secondary mb-4">
                Real Emergency Response System
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                EmergencyGuard is a functional emergency response application
                that connects to real emergency services.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-primary mr-2" />
                  How It Works
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Emergency buttons initiate actual calls to 911 and emergency
                    services
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    GPS location is automatically shared with emergency
                    responders
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Emergency contacts receive real SMS and email notifications
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    All emergency events are logged with timestamps and
                    locations
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-warning mr-2" />
                  Important Disclaimers
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-warning mr-3 mt-0.5 flex-shrink-0" />
                    This app supplements but does not replace calling 911
                    directly
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-warning mr-3 mt-0.5 flex-shrink-0" />
                    App creators are not responsible for emergency response
                    delays
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-warning mr-3 mt-0.5 flex-shrink-0" />
                    Network connectivity required for all emergency features
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-warning mr-3 mt-0.5 flex-shrink-0" />
                    Test the app features when NOT in an actual emergency
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <Heart className="h-6 w-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Use Responsibly
                  </h4>
                  <p className="text-yellow-700 text-sm">
                    By using EmergencyGuard, you acknowledge that this is a real
                    emergency response system. False emergency calls are illegal
                    and can result in serious consequences. Only use emergency
                    features during genuine emergencies that require immediate
                    assistance.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                For questions about this system, contact{" "}
                <a
                  href="mailto:support@emergencyguard.com"
                  className="text-primary hover:underline"
                >
                  support@emergencyguard.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
