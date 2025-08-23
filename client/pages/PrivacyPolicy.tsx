import { Layout } from "@/components/Layout";
import { Shield, MapPin, Users, Lock, Settings, Scale, Eye } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: Eye,
      title: "Information Collected",
      content: "We collect your name, contact details, location data, and emergency contacts to provide timely assistance."
    },
    {
      icon: MapPin,
      title: "Location Data",
      content: "Real-time location is used only during emergencies or when you trigger alerts."
    },
    {
      icon: Users,
      title: "Contact Sharing",
      content: "Emergency contacts you add will be notified during critical alerts. We do not sell or share your data with third parties."
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "All data is encrypted in transit and at rest. We follow industry standards for security."
    },
    {
      icon: Settings,
      title: "User Control",
      content: "You can update or delete your personal data anytime from app settings."
    },
    {
      icon: Scale,
      title: "Legal Compliance",
      content: "Data may be shared with authorities only in genuine emergency situations as required by law."
    }
  ];

  const dataTypes = [
    { type: "Personal Information", examples: "Name, phone number, email address" },
    { type: "Location Data", examples: "GPS coordinates, emergency location history" },
    { type: "Emergency Contacts", examples: "Contact names, phone numbers, relationship" },
    { type: "Usage Data", examples: "App usage patterns, emergency response times" },
    { type: "Device Information", examples: "Device type, operating system, app version" }
  ];

  return (
    <Layout>
      <div className="py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4 mr-2" />
              Privacy & Security
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Your privacy matters to us. Here's how we handle your data:
            </p>
          </div>

          {/* Privacy Principles */}
          <div className="mb-12 bg-gradient-to-r from-safe/5 to-primary/5 rounded-xl p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4 text-center">
              Our Privacy Principles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-safe/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-safe" />
                </div>
                <h3 className="font-semibold text-secondary mb-2">Transparency</h3>
                <p className="text-sm text-slate-600">Clear about what data we collect and why</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-secondary mb-2">Security</h3>
                <p className="text-sm text-slate-600">Industry-standard encryption and protection</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Settings className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-secondary mb-2">Control</h3>
                <p className="text-sm text-slate-600">You control your data and privacy settings</p>
              </div>
            </div>
          </div>

          {/* Data Collection */}
          <div className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary mb-8">
              Data We Collect
            </h2>
            <div className="space-y-4">
              {dataTypes.map((data, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg p-4 border border-slate-200 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-secondary">{data.type}</h3>
                    <p className="text-sm text-slate-600">{data.examples}</p>
                  </div>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-8 mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary">
              How We Protect Your Privacy
            </h2>
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-slate-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl lg:text-2xl font-semibold text-secondary mb-3">
                        {section.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Your Rights */}
          <div className="mb-12 bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold text-secondary mb-6">Your Privacy Rights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-safe/10 rounded-full flex items-center justify-center">
                    <span className="text-safe font-bold text-sm">✓</span>
                  </div>
                  <span className="text-slate-600">Access your personal data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-safe/10 rounded-full flex items-center justify-center">
                    <span className="text-safe font-bold text-sm">✓</span>
                  </div>
                  <span className="text-slate-600">Correct inaccurate information</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-safe/10 rounded-full flex items-center justify-center">
                    <span className="text-safe font-bold text-sm">✓</span>
                  </div>
                  <span className="text-slate-600">Delete your account and data</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-safe/10 rounded-full flex items-center justify-center">
                    <span className="text-safe font-bold text-sm">✓</span>
                  </div>
                  <span className="text-slate-600">Control data sharing preferences</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-safe/10 rounded-full flex items-center justify-center">
                    <span className="text-safe font-bold text-sm">✓</span>
                  </div>
                  <span className="text-slate-600">Export your data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-safe/10 rounded-full flex items-center justify-center">
                    <span className="text-safe font-bold text-sm">✓</span>
                  </div>
                  <span className="text-slate-600">Opt out of non-essential features</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 lg:p-8">
            <div className="text-center">
              <h2 className="text-xl lg:text-2xl font-semibold text-secondary mb-4">
                Privacy Questions?
              </h2>
              <p className="text-slate-600 mb-6">
                If you have any questions about this Privacy Policy or how we handle your data, please contact us.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-600 mr-2">Email us at:</span>
                <a 
                  href="mailto:privacy@emergencyguard.com"
                  className="text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  privacy@emergencyguard.com
                </a>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-8 text-center text-slate-500">
            <p>Last updated: December 2024</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
