import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Phone,
  MapPin,
  Download,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Timer,
  FileText,
  Calendar,
} from "lucide-react";

export default function EmergencyHistory() {
  // Mock data for emergency history
  const emergencyEvents = [
    {
      id: 1,
      type: "Medical Emergency",
      date: "2024-12-15",
      time: "14:30",
      location: "123 Main St, Downtown",
      status: "Resolved",
      responseTime: "2:45",
      contacts: ["John Doe", "Jane Smith"],
      notes:
        "Successful response from paramedics. Patient transported to General Hospital.",
    },
    {
      id: 2,
      type: "Emergency Call",
      date: "2024-12-10",
      time: "09:15",
      location: "456 Oak Ave, Riverside",
      status: "Resolved",
      responseTime: "1:20",
      contacts: ["Emergency Services", "Mom"],
      notes: "False alarm - pocket dial. Confirmed safety with responders.",
    },
    {
      id: 3,
      type: "Safety Alert",
      date: "2024-12-05",
      time: "22:45",
      location: "789 Pine St, Westside",
      status: "Resolved",
      responseTime: "0:45",
      contacts: ["Dad", "Sister"],
      notes:
        "Triggered panic button during late night walk. Safely reached destination.",
    },
    {
      id: 4,
      type: "Medical Emergency",
      date: "2024-11-28",
      time: "16:20",
      location: "321 Elm St, Central Park",
      status: "Resolved",
      responseTime: "3:10",
      contacts: ["Emergency Services", "John Doe"],
      notes: "Minor injury during jogging. First aid provided on scene.",
    },
  ];

  const stats = [
    { label: "Total Emergencies", value: "4", icon: AlertTriangle },
    { label: "Avg Response Time", value: "2:00", icon: Timer },
    { label: "Successful Resolutions", value: "100%", icon: CheckCircle },
    { label: "Contacts Notified", value: "8", icon: Phone },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-safe/10 text-safe";
      case "Active":
        return "bg-emergency/10 text-emergency";
      case "Pending":
        return "bg-warning/10 text-warning";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Medical Emergency":
        return <AlertTriangle className="h-5 w-5 text-emergency" />;
      case "Emergency Call":
        return <Phone className="h-5 w-5 text-primary" />;
      case "Safety Alert":
        return <CheckCircle className="h-5 w-5 text-warning" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-slate-400" />;
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
                  <Clock className="h-4 w-4 mr-2" />
                  Emergency Records
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-secondary mb-4">
                  Emergency History
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl">
                  View a comprehensive log of your past emergency events,
                  response times, and incident details.
                </p>
              </div>
              <div className="mt-6 lg:mt-0">
                <Button className="bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Export History
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

          {/* Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search emergency events..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <Button variant="outline" className="sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Button variant="outline" className="sm:w-auto">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>

          {/* Emergency Events List */}
          <div className="space-y-6">
            {emergencyEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Event Details */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getTypeIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <h3 className="text-xl font-semibold text-secondary">
                            {event.type}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}
                          >
                            {event.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-slate-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="text-sm">
                              {event.date} at {event.time}
                            </span>
                          </div>
                          <div className="flex items-center text-slate-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                          <div className="flex items-center text-slate-600">
                            <Timer className="h-4 w-4 mr-2" />
                            <span className="text-sm">
                              Response: {event.responseTime}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-secondary mb-2">
                            Contacts Notified:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {event.contacts.map((contact, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                              >
                                {contact}
                              </span>
                            ))}
                          </div>
                        </div>

                        {event.notes && (
                          <div className="bg-slate-50 rounded-lg p-4">
                            <h4 className="font-medium text-secondary mb-2 flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              Incident Notes:
                            </h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                              {event.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Export Section */}
          <div className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 lg:p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-secondary mb-4">
                Export Your Emergency History
              </h2>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Download your complete emergency history for personal records or
                to share with authorities as needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Empty State (hidden when there are events) */}
          {emergencyEvents.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-semibold text-secondary mb-4">
                No Emergency History
              </h2>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                You haven't had any emergency events yet. When you do, they'll
                appear here with detailed logs and reports.
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                Learn About Emergency Features
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
