import { Layout } from "@/components/Layout";
import { Shield, AlertTriangle, Users, Database, Gavel, RefreshCw } from "lucide-react";

export default function TermsOfService() {
  const sections = [
    {
      icon: Users,
      title: "Eligibility",
      content: "You must be at least 13 years old to use the app."
    },
    {
      icon: Shield,
      title: "Use of Service",
      content: "EmergencyGuard is for personal safety and emergency assistance only. Any misuse or fraudulent activity is strictly prohibited."
    },
    {
      icon: AlertTriangle,
      title: "User Responsibilities",
      content: "You are responsible for keeping your contact and location information accurate and up-to-date."
    },
    {
      icon: Gavel,
      title: "Service Limitations",
      content: "While we strive to provide reliable emergency connection, we do not guarantee uninterrupted service or immediate response from emergency contacts or authorities."
    },
    {
      icon: Database,
      title: "Data Usage",
      content: "Your location and contact data may be used to facilitate emergency help and notifications."
    },
    {
      icon: AlertTriangle,
      title: "Termination",
      content: "We may suspend or terminate accounts that violate these terms without prior notice."
    },
    {
      icon: RefreshCw,
      title: "Changes",
      content: "Terms may be updated periodically. Continued use signifies acceptance of changes."
    }
  ];

  return (
    <Layout>
      <div className="py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Gavel className="h-4 w-4 mr-2" />
              Legal Document
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-secondary mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Welcome to EmergencyGuard. By using our app, you agree to the following terms:
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
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
                      <h2 className="text-xl lg:text-2xl font-semibold text-secondary mb-3">
                        {section.title}
                      </h2>
                      <p className="text-slate-600 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Information */}
          <div className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 lg:p-8">
            <div className="text-center">
              <h2 className="text-xl lg:text-2xl font-semibold text-secondary mb-4">
                Questions About Our Terms?
              </h2>
              <p className="text-slate-600 mb-6">
                If you have any questions about these Terms of Service, please don't hesitate to contact us.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-600 mr-2">Email us at:</span>
                <a 
                  href="mailto:support@emergencyguard.com"
                  className="text-primary font-medium hover:text-primary/80 transition-colors"
                >
                  support@emergencyguard.com
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
