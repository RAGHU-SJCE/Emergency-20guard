import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useEmergencyServices } from "@/hooks/use-emergency-services";
import { EmergencyEvent } from "@shared/api";
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
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function EmergencyHistory() {
  const emergencyServices = useEmergencyServices();
  const [emergencyEvents, setEmergencyEvents] = useState<EmergencyEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<EmergencyEvent[]>([]);

  // Load emergency history on component mount
  useEffect(() => {
    loadEmergencyHistory();
  }, []);

  // Filter events when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEvents(emergencyEvents);
    } else {
      const filtered = emergencyEvents.filter(
        (event) =>
          event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.address
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          event.contacts.some((contact) =>
            contact.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
      setFilteredEvents(filtered);
    }
  }, [searchTerm, emergencyEvents]);

  const loadEmergencyHistory = async () => {
    try {
      setIsLoading(true);
      const response = await emergencyServices.getEmergencyHistory();

      if (response.success) {
        setEmergencyEvents(response.history);
        setFilteredEvents(response.history);
      } else {
        console.error("Failed to load emergency history:", response.message);
      }
    } catch (error) {
      console.error("Error loading emergency history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportHistory = async (format: "pdf" | "csv") => {
    try {
      // In a real implementation, this would call an export API
      const exportData = {
        events: filteredEvents,
        exportDate: new Date().toISOString(),
        format,
      };

      // Create downloadable file
      const dataStr =
        format === "csv"
          ? convertToCSV(filteredEvents)
          : JSON.stringify(exportData, null, 2);

      const dataBlob = new Blob([dataStr], {
        type: format === "csv" ? "text/csv" : "application/json",
      });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `emergency-history-${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`Emergency history exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export emergency history");
    }
  };

  const convertToCSV = (events: EmergencyEvent[]): string => {
    const headers = [
      "Date",
      "Time",
      "Type",
      "Location",
      "Status",
      "Response Time",
      "Contacts",
      "Notes",
      "Call ID",
    ];
    const rows = events.map((event) => [
      event.date,
      event.time,
      event.type,
      event.location.address ||
        `${event.location.latitude}, ${event.location.longitude}`,
      event.status,
      event.responseTime,
      event.contacts.join("; "),
      event.notes.replace(/,/g, ";"), // Replace commas to avoid CSV issues
      event.callId || "",
    ]);

    return [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");
  };

  const stats = [
    {
      label: "Total Emergencies",
      value: emergencyEvents.length.toString(),
      icon: AlertTriangle,
    },
    {
      label: "Avg Response Time",
      value:
        emergencyEvents.length > 0
          ? calculateAverageResponseTime(emergencyEvents)
          : "N/A",
      icon: Timer,
    },
    {
      label: "Successful Resolutions",
      value:
        emergencyEvents.length > 0
          ? `${Math.round((emergencyEvents.filter((e) => e.status === "Resolved").length / emergencyEvents.length) * 100)}%`
          : "N/A",
      icon: CheckCircle,
    },
    {
      label: "Contacts Notified",
      value: emergencyEvents
        .reduce((total, event) => total + event.contacts.length, 0)
        .toString(),
      icon: Phone,
    },
  ];

  const calculateAverageResponseTime = (events: EmergencyEvent[]): string => {
    const times = events.map((event) => {
      const [minutes, seconds] = event.responseTime.split(":").map(Number);
      return minutes * 60 + seconds;
    });

    const avgSeconds =
      times.reduce((sum, time) => sum + time, 0) / times.length;
    const avgMinutes = Math.floor(avgSeconds / 60);
    const remainingSeconds = Math.round(avgSeconds % 60);

    return `${avgMinutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-safe/10 text-safe border-safe/20";
      case "Active":
        return "bg-emergency/10 text-emergency border-emergency/20";
      case "Pending":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
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

  if (isLoading) {
    return (
      <Layout>
        <div className="py-20 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading emergency history...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
                  View a comprehensive log of your real emergency events,
                  response times, and incident details.
                </p>
              </div>
              <div className="mt-6 lg:mt-0 flex gap-2">
                <Button
                  onClick={loadEmergencyHistory}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  onClick={() => exportHistory("csv")}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
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

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search emergency events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[44px]"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" className="sm:w-auto">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
              </div>
            </div>
          </div>

          {/* Emergency Events List */}
          {filteredEvents.length > 0 ? (
            <div className="space-y-6">
              {filteredEvents.map((event) => (
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
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}
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
                              <span className="text-sm">
                                {event.location.address ||
                                  `${event.location.latitude.toFixed(4)}, ${event.location.longitude.toFixed(4)}`}
                              </span>
                            </div>
                            <div className="flex items-center text-slate-600">
                              <Timer className="h-4 w-4 mr-2" />
                              <span className="text-sm">
                                Response: {event.responseTime}
                              </span>
                            </div>
                          </div>

                          {event.callId && (
                            <div className="mb-4">
                              <span className="text-sm font-medium text-secondary">
                                Call ID:{" "}
                              </span>
                              <span className="text-sm text-slate-600 font-mono">
                                {event.callId}
                              </span>
                            </div>
                          )}

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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportHistory("csv")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-semibold text-secondary mb-4">
                {emergencyEvents.length === 0
                  ? "No Emergency History"
                  : "No Matching Events"}
              </h2>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                {emergencyEvents.length === 0
                  ? "You haven't had any emergency events yet. When you do, they'll appear here with detailed logs and reports."
                  : "No emergency events match your current search criteria. Try adjusting your search terms."}
              </p>
              {emergencyEvents.length === 0 && (
                <Button className="bg-primary hover:bg-primary/90">
                  Learn About Emergency Features
                </Button>
              )}
            </div>
          )}

          {/* Export Section */}
          <div className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 lg:p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-secondary mb-4">
                Export Your Emergency History
              </h2>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Download your complete emergency history for personal records or
                to share with authorities as needed. All data is exported with
                timestamps and location information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => exportHistory("csv")}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <Button onClick={() => exportHistory("pdf")} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export as JSON
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
