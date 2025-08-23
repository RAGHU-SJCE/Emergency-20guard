import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Users,
  Plus,
  Phone,
  Mail,
  Edit,
  Trash2,
  Settings,
  Heart,
  Shield,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Bell,
} from "lucide-react";
import { useState } from "react";

export default function EmergencyContacts() {
  // Mock data for emergency contacts
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "John Doe",
      relationship: "Spouse",
      phone: "+1 (555) 123-4567",
      email: "john.doe@email.com",
      notifications: {
        sms: true,
        email: true,
        inApp: true,
      },
      verified: true,
      priority: 1,
    },
    {
      id: 2,
      name: "Jane Smith",
      relationship: "Sister",
      phone: "+1 (555) 987-6543",
      email: "jane.smith@email.com",
      notifications: {
        sms: true,
        email: false,
        inApp: true,
      },
      verified: true,
      priority: 2,
    },
    {
      id: 3,
      name: "Dr. Sarah Wilson",
      relationship: "Doctor",
      phone: "+1 (555) 246-8135",
      email: "dr.wilson@healthcare.com",
      notifications: {
        sms: false,
        email: true,
        inApp: false,
      },
      verified: false,
      priority: 3,
    },
    {
      id: 4,
      name: "Mike Johnson",
      relationship: "Best Friend",
      phone: "+1 (555) 369-2580",
      email: "mike.j@email.com",
      notifications: {
        sms: true,
        email: true,
        inApp: true,
      },
      verified: true,
      priority: 4,
    },
  ]);

  const stats = [
    { label: "Total Contacts", value: contacts.length.toString(), icon: Users },
    {
      label: "Verified",
      value: contacts.filter((c) => c.verified).length.toString(),
      icon: CheckCircle,
    },
    {
      label: "SMS Enabled",
      value: contacts.filter((c) => c.notifications.sms).length.toString(),
      icon: MessageSquare,
    },
    {
      label: "Email Enabled",
      value: contacts.filter((c) => c.notifications.email).length.toString(),
      icon: Mail,
    },
  ];

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case "spouse":
      case "partner":
        return <Heart className="h-5 w-5 text-emergency" />;
      case "parent":
      case "father":
      case "mother":
      case "dad":
      case "mom":
        return <Users className="h-5 w-5 text-primary" />;
      case "doctor":
      case "physician":
        return <Shield className="h-5 w-5 text-safe" />;
      default:
        return <Users className="h-5 w-5 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-emergency/10 text-emergency border-emergency/20";
      case 2:
        return "bg-warning/10 text-warning border-warning/20";
      case 3:
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <Layout>
      <div className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                  <Users className="h-4 w-4 mr-2" />
                  Emergency Network
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-secondary mb-4">
                  Emergency Contacts
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl">
                  Manage people who should be notified in case of emergency.
                  They will only be contacted during genuine emergencies or when
                  alerts are triggered.
                </p>
              </div>
              <div className="mt-6 lg:mt-0">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl lg:text-3xl font-bold text-secondary">
                        {stat.value}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        {stat.label}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Contact Section */}
          <div className="bg-gradient-to-r from-primary/5 to-safe/5 rounded-xl p-6 lg:p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-secondary mb-4">
                Add Emergency Contact
              </h2>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Add people who should be notified in case of emergency. Enter
                their contact information and choose how they should be
                notified.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-secondary mb-1">
                    Add Details
                  </h3>
                  <p className="text-sm text-slate-600">
                    Name, phone, and relationship
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-safe/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Settings className="h-6 w-6 text-safe" />
                  </div>
                  <h3 className="font-medium text-secondary mb-1">
                    Set Notifications
                  </h3>
                  <p className="text-sm text-slate-600">
                    Choose SMS, email, or in-app alerts
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-warning" />
                  </div>
                  <h3 className="font-medium text-secondary mb-1">
                    Verify Contact
                  </h3>
                  <p className="text-sm text-slate-600">
                    Ensure they can receive notifications
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contacts List */}
          <div className="space-y-6">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Contact Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getRelationshipIcon(contact.relationship)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-secondary">
                              {contact.name}
                            </h3>
                            <p className="text-slate-600">
                              {contact.relationship}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(contact.priority)}`}
                            >
                              Priority {contact.priority}
                            </span>
                            {contact.verified ? (
                              <span className="flex items-center px-3 py-1 bg-safe/10 text-safe rounded-full text-xs font-medium">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </span>
                            ) : (
                              <span className="flex items-center px-3 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Unverified
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-slate-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span className="text-sm">{contact.phone}</span>
                          </div>
                          <div className="flex items-center text-slate-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <span className="text-sm">{contact.email}</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-secondary mb-3">
                            Notification Settings:
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            <div
                              className={`flex items-center px-3 py-2 rounded-lg ${contact.notifications.sms ? "bg-safe/10 text-safe" : "bg-slate-100 text-slate-500"}`}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              <span className="text-sm">SMS</span>
                              {contact.notifications.sms && (
                                <CheckCircle className="h-3 w-3 ml-2" />
                              )}
                            </div>
                            <div
                              className={`flex items-center px-3 py-2 rounded-lg ${contact.notifications.email ? "bg-safe/10 text-safe" : "bg-slate-100 text-slate-500"}`}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              <span className="text-sm">Email</span>
                              {contact.notifications.email && (
                                <CheckCircle className="h-3 w-3 ml-2" />
                              )}
                            </div>
                            <div
                              className={`flex items-center px-3 py-2 rounded-lg ${contact.notifications.inApp ? "bg-safe/10 text-safe" : "bg-slate-100 text-slate-500"}`}
                            >
                              <Bell className="h-4 w-4 mr-2" />
                              <span className="text-sm">In-App</span>
                              {contact.notifications.inApp && (
                                <CheckCircle className="h-3 w-3 ml-2" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    {!contact.verified && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-safe border-safe hover:bg-safe/10"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-emergency border-emergency hover:bg-emergency/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Verification Section */}
          <div className="mt-12 bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-slate-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-secondary mb-4">
                Contact Verification
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                We recommend verifying contacts to ensure notifications are
                received promptly during emergencies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-secondary mb-4">
                  Why Verify Contacts?
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Ensures contact information is current and working
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Confirms they can receive emergency notifications
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-safe mr-3 mt-0.5 flex-shrink-0" />
                    Reduces failed notification attempts during emergencies
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-secondary mb-4">
                  Verification Process
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <span className="w-5 h-5 bg-primary/10 text-primary rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold">
                      1
                    </span>
                    Send test notification to contact
                  </li>
                  <li className="flex items-start">
                    <span className="w-5 h-5 bg-primary/10 text-primary rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold">
                      2
                    </span>
                    Contact confirms receipt of test message
                  </li>
                  <li className="flex items-start">
                    <span className="w-5 h-5 bg-primary/10 text-primary rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-bold">
                      3
                    </span>
                    Contact is marked as verified in the system
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Empty State (hidden when there are contacts) */}
          {contacts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-semibold text-secondary mb-4">
                No Emergency Contacts
              </h2>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Add trusted contacts who should be notified during emergencies.
                Having emergency contacts can provide crucial support when you
                need it most.
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Contact
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
